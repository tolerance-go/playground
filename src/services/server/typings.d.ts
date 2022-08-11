declare namespace API {
  type App = {
    id: number;
    title: string;
    desc?: string;
    app_data?: string;
    labels?: string[];
  };

  type AppControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type AppControllerIndexParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** title  */
    title?: string;
    /** labels  */
    labels?: string;
  };

  type AppControllerShowParams = {
    /** id  */
    id: string;
  };

  type AppControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type AppListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: App[];
  };

  type AppShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: App;
  };

  type BaseResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
  };

  type Component = {
    id: number;
    name: string;
    desc?: string;
    app_id: string;
    stage_data?: string;
  };

  type ComponentControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type ComponentControllerIndexParams = {
    /** appId  */
    appId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type ComponentControllerShowParams = {
    /** id  */
    id: string;
  };

  type ComponentControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type ComponentListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Component[];
  };

  type ComponentShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Component;
  };

  type CreationApp = {
    title: string;
    desc?: string;
    app_data?: string;
    labels?: string[];
  };

  type CreationComponent = {
    name: string;
    desc?: string;
    app_id: string;
    stage_data?: string;
  };

  type CreationData = {
    name: string;
    desc?: string;
    data?: string;
    app_id: string;
  };

  type CreationPage = {
    path: string;
    app_id: string;
    version_id?: string;
    stage_data?: string;
  };

  type CreationVersion = {
    name: string;
    app_id: string;
    pageIds?: number[];
  };

  type Data = {
    id: number;
    name: string;
    desc?: string;
    data?: string;
    app_id: string;
  };

  type DataControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type DataControllerIndexParams = {
    /** appId  */
    appId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type DataControllerShowParams = {
    /** id  */
    id: string;
  };

  type DataControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type DataListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Data[];
  };

  type DataShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Data;
  };

  type Page = {
    id: number;
    path: string;
    app_id: string;
    version_id?: string;
    stage_data?: string;
  };

  type PageControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type PageControllerIndexParams = {
    /** appId  */
    appId?: number;
    /** versionId  */
    versionId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type PageControllerShowParams = {
    /** id  */
    id: string;
  };

  type PageControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type PageListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Page[];
  };

  type PageShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Page;
  };

  type Version = {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    app_id: string;
  };

  type VersionControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type VersionControllerIndexParams = {
    /** appId  */
    appId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type VersionControllerShowParams = {
    /** id  */
    id: string;
  };

  type VersionControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type VersionListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Version[];
  };

  type VersionShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data?: Version;
  };
}
