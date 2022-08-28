declare namespace API {
  type App = {
    id: string;
    title: string;
    desc?: string;
    appData?: string;
    historyData?: string;
    stageSizeData?: string;
    labels?: string[];
  };

  type AppControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type AppControllerIndexIncludeUserParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** title  */
    title?: string;
    /** labels  */
    labels?: string;
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

  type AppIncludeUserListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownAppIncludeUser[];
  };

  type AppListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownApp[];
  };

  type AppShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownApp;
  };

  type BaseResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
  };

  type ComIheritRelation = {
    id: string;
    appId: string;
    componentId: string;
    fromId: string;
    toId: string;
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
    id: string;
    content?: string;
    replyTo?: string;
    likeNum?: number;
    dislikeNum?: number;
    discussId: string;
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
    id: string;
    name: string;
    desc?: string;
    app_id: string;
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
    id: string;
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
    appData?: string;
    historyData?: string;
    stageSizeData?: string;
    labels?: string[];
  };

  type CreationComIheritRelation = {
    appId: string;
    componentId: string;
    fromId: string;
    toId: string;
  };

  type CreationComment = {
    content?: string;
    replyTo?: string;
    likeNum?: number;
    dislikeNum?: number;
    discussId: string;
  };

  type CreationComponent = {
    name: string;
    desc?: string;
    app_id: string;
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
    pageId: string;
    resolved?: boolean;
  };

  type CreationPage = {
    path: string;
    appId: string;
    versionId?: string;
    stage_data?: string;
    nodesStructures?: PlainObject;
    nodesStyles?: PlainObject;
    nodesSettings?: PlainObject;
    nodesEvents?: PlainObject;
    nodesActions?: PlainObject;
    nodesStatus?: PlainObject;
    nodesStatusRelations?: PlainObject;
    nodesDefaultsStatus?: PlainObject;
  };

  type CreationUser = {
    nickname?: string;
    password: string;
    username: string;
    email?: string;
    avatar?: string;
  };

  type CreationVersion = {
    name: string;
    app_id: string;
    pageIds?: string[];
  };

  type CreationWidget = {
    name: string;
    elementType: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type CreationWidgetGroup = {
    name: string;
    widgetLibId?: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type CreationWidgetLib = {
    name: string;
    widgetLibId?: string;
    userId?: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type CreationWithRelationComponent = {
    fromComId: string;
    appId: string;
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
    id: string;
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
    id: string;
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
    pageId: string;
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
    id: string[];
  };

  type Identity = {
    id: string;
  };

  type LoginAuth = {
    password: string;
    username: string;
  };

  type Page = {
    id: string;
    path: string;
    appId: string;
    versionId?: string;
    stage_data?: string;
    nodesStructures?: PlainObject;
    nodesStyles?: PlainObject;
    nodesSettings?: PlainObject;
    nodesEvents?: PlainObject;
    nodesActions?: PlainObject;
    nodesStatus?: PlainObject;
    nodesStatusRelations?: PlainObject;
    nodesDefaultsStatus?: PlainObject;
  };

  type PageControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type PageControllerIndexParams = {
    appId?: any;
    limit?: number;
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
    data: ShownPage[];
  };

  type PageShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownPage;
  };

  type PlainObject = {};

  type ResultResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: boolean;
  };

  type ShareAppRequest = {
    userIds: string[];
    appId: string;
  };

  type ShownApp = {
    userId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    desc?: string;
    appData?: string;
    historyData?: string;
    stageSizeData?: string;
    labels?: string[];
  };

  type ShownAppIncludeUser = {
    userId: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    title: string;
    desc?: string;
    appData?: string;
    historyData?: string;
    stageSizeData?: string;
    labels?: string[];
    users: ShownUser[];
  };

  type ShownComIheritRelation = {
    createdAt: string;
    updatedAt: string;
    id: string;
    appId: string;
    componentId: string;
    fromId: string;
    toId: string;
  };

  type ShownComment = {
    id: string;
    createdAt: string;
    updatedAt: string;
    content?: string;
    replyTo?: string;
    likeNum?: number;
    dislikeNum?: number;
    discussId: string;
  };

  type ShownComponent = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    desc?: string;
    app_id: string;
    stage_data?: string;
    comIheritRelationId?: number;
    usedInPageIds?: number[];
  };

  type ShownDatabase = {
    id: string;
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
    id: string;
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
    pageId: string;
    resolved?: boolean;
  };

  type ShownPage = {
    createdAt: string;
    updatedAt: string;
    id: string;
    path: string;
    appId: string;
    versionId?: string;
    stage_data?: string;
    nodesStructures?: PlainObject;
    nodesStyles?: PlainObject;
    nodesSettings?: PlainObject;
    nodesEvents?: PlainObject;
    nodesActions?: PlainObject;
    nodesStatus?: PlainObject;
    nodesStatusRelations?: PlainObject;
    nodesDefaultsStatus?: PlainObject;
  };

  type ShownUser = {
    createdAt: string;
    updatedAt: string;
    id: string;
    nickname?: string;
    password: string;
    username: string;
    email?: string;
    avatar?: string;
  };

  type ShownWidget = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    elementType: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type ShownWidgetGroup = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    widgetLibId?: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type ShownWidgetGroupIncludeLib = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    widgetLibId?: string;
    type: string;
    desc?: string;
    labels?: string[];
    widgetLib: ShownWidgetLib;
  };

  type ShownWidgetGroupIncludeLibListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetGroupIncludeLib[];
  };

  type ShownWidgetGroupIncludeWidgets = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    widgetLibId?: string;
    type: string;
    desc?: string;
    labels?: string[];
    widgets: ShownWidget[];
  };

  type ShownWidgetGroupIncludeWidgetsListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetGroupIncludeWidgets[];
  };

  type ShownWidgetIncludeGroupIncludeLib = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    elementType: string;
    type: string;
    desc?: string;
    labels?: string[];
    widgetGroup: ShownWidgetGroupIncludeLib;
  };

  type ShownWidgetIncludeGroupIncludeLibListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetIncludeGroupIncludeLib[];
  };

  type ShownWidgetLib = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    widgetLibId?: string;
    userId?: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type ShownWidgetLibIncludeGroupsIncludeWidgets = {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
    widgetLibId?: string;
    userId?: string;
    type: string;
    desc?: string;
    labels?: string[];
    widgetGroups: ShownWidgetGroupIncludeWidgets[];
  };

  type ShownWidgetLibIncludeGroupsIncludeWidgetsListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetLibIncludeGroupsIncludeWidgets[];
  };

  type StringArrayResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: string[];
  };

  type UpdationApp = {
    title?: string;
    desc?: string;
    appData?: string;
    historyData?: string;
    stageSizeData?: string;
    labels?: string[];
  };

  type UpdationComIheritRelation = {
    appId?: string;
    componentId?: string;
    fromId?: string;
    toId?: string;
  };

  type UpdationComment = {
    content?: string;
    replyTo?: string;
    likeNum?: number;
    dislikeNum?: number;
    discussId?: string;
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
    pageId?: string;
    resolved?: boolean;
  };

  type UpdationPage = {
    path?: string;
    appId?: string;
    versionId?: string;
    stage_data?: string;
    nodesStructures?: PlainObject;
    nodesStyles?: PlainObject;
    nodesSettings?: PlainObject;
    nodesEvents?: PlainObject;
    nodesActions?: PlainObject;
    nodesStatus?: PlainObject;
    nodesStatusRelations?: PlainObject;
    nodesDefaultsStatus?: PlainObject;
  };

  type UpdationUser = {
    nickname?: string;
    password?: string;
    username?: string;
    email?: string;
    avatar?: string;
  };

  type UpdationWidget = {
    name?: string;
    elementType?: string;
    type?: string;
    desc?: string;
    labels?: string[];
  };

  type UpdationWidgetGroup = {
    name?: string;
    widgetLibId?: string;
    type?: string;
    desc?: string;
    labels?: string[];
  };

  type UpdationWidgetLib = {
    name?: string;
    widgetLibId?: string;
    userId?: string;
    type?: string;
    desc?: string;
    labels?: string[];
  };

  type User = {
    id: string;
    nickname?: string;
    password: string;
    username: string;
    email?: string;
    avatar?: string;
  };

  type UserControllerDestroyParams = {
    /** id  */
    id: string;
  };

  type UserControllerIndexParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** title  */
    title?: string;
    /** labels  */
    labels?: string;
  };

  type UserControllerShowParams = {
    /** id  */
    id: string;
  };

  type UserControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type UserListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownUser[];
  };

  type UserShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownUser;
  };

  type Version = {
    id: string;
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

  type Widget = {
    id: string;
    name: string;
    elementType: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type WidgetControllerBaseIndexParams = {
    /** id  */
    id: string;
  };

  type WidgetControllerCreateParams = {
    /** id  */
    id: string;
  };

  type WidgetControllerIndexIncludeGroupAndLibParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** name  */
    name?: string;
    /** labels  */
    labels?: string;
  };

  type WidgetControllerIndexParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** name  */
    name?: string;
    /** labels  */
    labels?: string;
  };

  type WidgetControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type WidgetGroup = {
    id: string;
    name: string;
    widgetLibId?: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type WidgetGroupControllerBaseIndexParams = {
    /** id  */
    id: string;
  };

  type WidgetGroupControllerCreateParams = {
    /** id  */
    id: string;
  };

  type WidgetGroupControllerIndexIncludeWidgetsParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** name  */
    name?: string;
    /** labels  */
    labels?: string;
  };

  type WidgetGroupControllerIndexParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** name  */
    name?: string;
    /** labels  */
    labels?: string;
  };

  type WidgetGroupControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type WidgetGroupListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetGroup[];
  };

  type WidgetGroupShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetGroup;
  };

  type WidgetLib = {
    id: string;
    name: string;
    widgetLibId?: string;
    userId?: string;
    type: string;
    desc?: string;
    labels?: string[];
  };

  type WidgetLibControllerBaseIndexParams = {
    /** id  */
    id: string;
  };

  type WidgetLibControllerCreateParams = {
    /** id  */
    id: string;
  };

  type WidgetLibControllerIndexIncludeGroupsAndWidgetsParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** name  */
    name?: string;
    /** labels  */
    labels?: string;
  };

  type WidgetLibControllerIndexParams = {
    /** limit  */
    limit?: number;
    /** offset  */
    offset?: number;
    /** name  */
    name?: string;
    /** labels  */
    labels?: string;
  };

  type WidgetLibControllerUpdateParams = {
    /** id  */
    id: string;
  };

  type WidgetLibListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetLib[];
  };

  type WidgetLibShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidgetLib;
  };

  type WidgetListResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidget[];
  };

  type WidgetShowResponse = {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    showType?: number;
    data: ShownWidget;
  };
}
