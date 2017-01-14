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
    bot: (window as any).appConfig.apiAi,
}
