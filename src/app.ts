import React from 'react';
import { RequestConfig } from '@umijs/max';
import { message, notification, Typography } from 'antd';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  WARN_NOTIFICATION = 4,
  ERROR_NOTIFICATION = 5,
  REDIRECT = 9,
}

const getNotifactionDescEle = (errorContent: string) => {
  return errorContent
    ? React.createElement(
        Typography.Paragraph,
        {
          type: 'secondary',
          ellipsis: {
            rows: 2,
            expandable: true,
          },
          copyable: true,
        },
        JSON.stringify(errorContent),
      )
    : null;
};

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

const logError = (errorInfo: ResponseStructure | undefined) => {
  if (errorInfo) {
    const { errorMessage, data } = errorInfo;

    switch (errorInfo.showType) {
      case ErrorShowType.SILENT:
        // do nothing
        break;
      case ErrorShowType.WARN_MESSAGE:
        message.warn(errorMessage);
        break;
      case ErrorShowType.ERROR_MESSAGE:
        message.error(errorMessage);
        break;
      case ErrorShowType.WARN_NOTIFICATION:
        notification.warn({
          message: errorMessage,
          description: getNotifactionDescEle(data),
        });
        break;
      case ErrorShowType.ERROR_NOTIFICATION:
        notification.error({
          message: errorMessage,
          description: getNotifactionDescEle(data),
        });
        break;
      case ErrorShowType.REDIRECT:
        // TODO: redirect
        break;
      default:
        message.error(errorMessage);
    }
  }
};

export const request: RequestConfig = {
  // requestInterceptors: [
  //   (options: RequestOptions) => {
  //     return { ...options, url: `/api${options.url}` };
  //   },
  // ],
  errorConfig: {
    // 错误抛出
    // 业务错误会进来 data 为 false 的时候，格式化错误信息然后抛出，
    // 让 errorHandler 处理
    errorThrower: (resData) => {
      const { success, data, errorCode, errorMessage, showType } =
        resData as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'serverError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    /**
     * 网络错误会进来 （axios catch）
     * 业务错误也会进来，通过 errorThrower
     */
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'serverError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          logError(errorInfo);
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        notification.error({
          message: `服务器内部错误: ${error.response.status}`,
          description: error.response.statusText,
        });
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },
};
