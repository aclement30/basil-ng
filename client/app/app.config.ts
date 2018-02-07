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

declare const _BASIL_API_AI_: any;

// Config values will be replaced by Webpack at build time
export const APP_CONFIG: IAppConfig = {
    canSpeechRecognition: !!webkitSpeechRecognition,
    bot: _BASIL_API_AI_,
}
