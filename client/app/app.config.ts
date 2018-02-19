// Config values will be replaced by Webpack at build time

declare const _BASIL_API_AI_: any;
declare const _BASIL_GOOGLE_CLIENT_ID_: any;

interface IWindow extends Window {
    webkitSpeechRecognition: any;
}

const { webkitSpeechRecognition }: IWindow = <IWindow>window;

interface IAppConfig {
    canSpeechRecognition: boolean;
    bot: IBotConfig;
}

interface IBotConfig {
    url: string;
    version: string;
    accessToken: string;
}

export const APP_CONFIG: IAppConfig = {
    canSpeechRecognition: !!webkitSpeechRecognition,
    bot: _BASIL_API_AI_,
}

export const GOOGLE_CLIENT_ID = _BASIL_GOOGLE_CLIENT_ID_;
