export enum Message {
    success = 'SUCCESS',
    failure = 'FAILURE',
}

export type respMessageType = Message.success | Message.failure;

export interface RespBodyInterface {
    success: boolean;
    message?: string;
    isPublic?: boolean;
    statusCode?: number;
    data?: Array<any> | Record<any, unknown>;
}
