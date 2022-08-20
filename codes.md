```
 document
        .getElementById('discuss-title')
        ?.querySelector('.ant-typography-edit')
        ?.dispatchEvent(
          new Event('click', { bubbles: true, cancelable: false }),
        );
        ```