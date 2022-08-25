declare namespace API {
  type App = {
    id: number;
    title: string;
    desc?: string;
    app_data?: string;
    history_data?: string;
    stage_size_data?: string;
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

  type AppControllerUpdateHistoryParams = {
    /** id  */
    id: string;
  };

  type AppControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type AppControllerUpdateStageSizeParams = {
    /** id  */
    id: string;
  };

  type AppListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: App[];
  };

  type AppShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: App;
  };

  type BaseResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
  };

  type ComIheritRelation = {
    id: number;
    appId: number;
    componentId: number;
    fromId: number;
    toId: number;
  };

  type ComIheritRelationControllerDestroyParams = {
    /** id  */
    id: number;
  };

  type ComIheritRelationControllerIndexParams = {
    appId?: number;
    limit?: number;
    offset?: number;
  };

  type ComIheritRelationControllerShowParams = {
    /** id  */
    id: string;
  };

  type ComIheritRelationControllerUpdateParams = {
    /** id  */
    id: number;
  };

  type ComIheritRelationListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownComIheritRelation[];
  };

  type ComIheritRelationShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownComIheritRelation;
  };

  type Comment = {
    id: number;
    content?: string;
    replyTo?: number;
    likeNum?: number;
    dislikeNum?: number;
    discussId: number;
  };

  type CommentControllerDestroyParams = {
    /** id  */
    id: number;
  };

  type CommentControllerIndexParams = {
    /** discussId  */
    discussId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type CommentControllerShowParams = {
    /** id  */
    id: string;
  };

  type CommentControllerUpdateParams = {
    /** id  */
    id: number;
  };

  type CommentListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownComment[];
  };

  type CommentShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownComment;
  };

  type Component = {
    id: number;
    name: string;
    desc?: string;
    app_id: number;
    stage_data?: string;
    comIheritRelationId?: number;
    usedInPageIds?: number[];
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
    data: ShownComponent[];
  };

  type ComponentShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownComponent;
  };

  type Counter = {
    id: number;
    count: number;
  };

  type CounterResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: Counter[];
  };

  type CountResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: number;
  };

  type CreationApp = {
    title: string;
    desc?: string;
    app_data?: string;
    history_data?: string;
    stage_size_data?: string;
    labels?: string[];
  };

  type CreationComIheritRelation = {
    appId: number;
    componentId: number;
    fromId: number;
    toId: number;
  };

  type CreationComment = {
    content?: string;
    replyTo?: number;
    likeNum?: number;
    dislikeNum?: number;
    discussId: number;
  };

  type CreationComponent = {
    name: string;
    desc?: string;
    app_id: number;
    stage_data?: string;
    comIheritRelationId?: number;
    usedInPageIds?: number[];
  };

  type CreationDatabase = {
    name: string;
    desc?: string;
    data?: string;
    app_id: string;
    logic_created_at?: string;
    logic_updated_at?: string;
  };

  type CreationDiscuss = {
    title?: string;
    desc?: string;
    belongsToComStatId: string;
    belongsToComId: string;
    left: number;
    top: number;
    containerWidth: number;
    containerHeight: number;
    containerLeft: number;
    containerTop: number;
    pageId: number;
    resolved?: boolean;
  };

  type CreationPage = {
    path: string;
    app_id: number;
    version_id?: number;
    stage_data?: string;
  };

  type CreationVersion = {
    name: string;
    app_id: string;
    pageIds?: number[];
  };

  type CreationWithRelationComponent = {
    fromComId: number;
    appId: number;
    name: string;
    desc?: string;
  };

  type CreationWithRelationComponentResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: CreationWithRelationComponentResponseData;
  };

  type CreationWithRelationComponentResponseData = {
    component: ShownComponent;
    comIheritRelation: ShownComIheritRelation;
  };

  type Database = {
    id: number;
    name: string;
    desc?: string;
    data?: string;
    app_id: string;
    logic_created_at?: string;
    logic_updated_at?: string;
  };

  type DatabaseControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type DatabaseControllerIndexParams = {
    /** appId  */
    appId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type DatabaseControllerShowParams = {
    /** id  */
    id: string;
  };

  type DatabaseControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type DatabaseListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownDatabase[];
  };

  type DatabaseShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownDatabase;
  };

  type Discuss = {
    id: number;
    title?: string;
    desc?: string;
    belongsToComStatId: string;
    belongsToComId: string;
    left: number;
    top: number;
    containerWidth: number;
    containerHeight: number;
    containerLeft: number;
    containerTop: number;
    pageId: number;
    resolved?: boolean;
  };

  type DiscussControllerCountCommentsParams = {
    /** pageId  */
    pageId?: number;
  };

  type DiscussControllerDestroyParams = {
    /** id  */
    id: number;
  };

  type DiscussControllerIndexParams = {
    /** pageId  */
    pageId?: number;
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
  };

  type DiscussControllerShowParams = {
    /** id  */
    id: string;
  };

  type DiscussControllerUpdateParams = {
    /** id  */
    id: number;
  };

  type DiscussListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownDiscuss[];
  };

  type DiscussShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownDiscuss;
  };

  type Identities = {
    id: number[];
  };

  type Identity = {
    id: number;
  };

  type Page = {
    id: number;
    path: string;
    app_id: number;
    version_id?: number;
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
    data: Page[];
  };

  type PageShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: Page;
  };

  type ShownComIheritRelation = {
    createdAt: string;
    updatedAt: string;
    id: number;
    appId: number;
    componentId: number;
    fromId: number;
    toId: number;
  };

  type ShownComment = {
    id: number;
    createdAt: string;
    updatedAt: string;
    content?: string;
    replyTo?: number;
    likeNum?: number;
    dislikeNum?: number;
    discussId: number;
  };

  type ShownComponent = {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    desc?: string;
    app_id: number;
    stage_data?: string;
    comIheritRelationId?: number;
    usedInPageIds?: number[];
  };

  type ShownDatabase = {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    desc?: string;
    data?: string;
    app_id: string;
    logic_created_at?: string;
    logic_updated_at?: string;
  };

  type ShownDiscuss = {
    id: number;
    createdAt: string;
    updatedAt: string;
    title?: string;
    desc?: string;
    belongsToComStatId: string;
    belongsToComId: string;
    left: number;
    top: number;
    containerWidth: number;
    containerHeight: number;
    containerLeft: number;
    containerTop: number;
    pageId: number;
    resolved?: boolean;
  };

  type UpdationComIheritRelation = {
    appId?: number;
    componentId?: number;
    fromId?: number;
    toId?: number;
  };

  type UpdationComment = {
    content?: string;
    replyTo?: number;
    likeNum?: number;
    dislikeNum?: number;
    discussId?: number;
  };

  type UpdationDiscuss = {
    title?: string;
    desc?: string;
    belongsToComStatId?: string;
    belongsToComId?: string;
    left?: number;
    top?: number;
    containerWidth?: number;
    containerHeight?: number;
    containerLeft?: number;
    containerTop?: number;
    pageId?: number;
    resolved?: boolean;
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
    data: Version[];
  };

  type VersionShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: Version;
  };
}
