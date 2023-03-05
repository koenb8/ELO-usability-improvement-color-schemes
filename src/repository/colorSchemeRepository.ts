export class ColorSchemeRepository {
    private static instance: ColorSchemeRepository;

    constructor() {
        this._update();
        addEventListener('storage', () => this._update());
        this._setupSharedLocalstorageListener();
    }

    public static getInstance() {
        if (this.instance === null || this.instance === undefined) {
          this.instance = new ColorSchemeRepository();
        }
    
        return this.instance;
    }

    private static LOCAL_STORAGE_KEY = 'ELO-usability-improvement.colorScheme';
    private static SHARED_LOCAL_STORAGE_IFRAME_PAGES = [
        "https://s.brightspace.com/",
        "https://cdn.lcs.brightspace.com/assets/third_party/postMessage/events.js"
    ];

    private _sharedLocalStorageIframes: HTMLIFrameElement[] = [];

    // set to default values (applied if localstorage value is undefined)
    private _colorScheme = {
        enabled: false,
        mainColor: "#47B39D",
        backgroundPrimary: "#10262E",
        backgroundSecondary: "#02181C",
        foregroundColor: "#A4C6DF"
    }

    public isEnabled() {
        return this._colorScheme.enabled;
    }

    public getMainColor() {
        return this._colorScheme.mainColor;
    }

    public getBackgroundPrimary() {
        return this._colorScheme.backgroundPrimary;
    }

    public getBackgroundSecondary() {
        return this._colorScheme.backgroundSecondary;
    }

    public getForegroundColor() {
        return this._colorScheme.foregroundColor;
    }

    public setEnabled(enabled: boolean) {
        this._colorScheme.enabled = enabled;
        this._save();
    }

    public setMainColor(color: string) {
        this._colorScheme.mainColor = color;
        this._save();
    }

    public setBackgroundPrimary(color: string) {
        this._colorScheme.backgroundPrimary = color;
        this._save();
    }

    public setBackgroundSecondary(color: string) {
        this._colorScheme.backgroundSecondary = color;
        this._save();
    }

    public setForegroundColor(color: string) {
        this._colorScheme.foregroundColor = color;
        this._save();
    }

    private _apply() {
        if (this._colorScheme.enabled) {
            document.documentElement.classList.add('color-scheme-enabled');

            document.documentElement.style.setProperty('--main-color', this._colorScheme.mainColor);
            document.documentElement.style.setProperty('--scheme-background-color-primary', this._colorScheme.backgroundPrimary);
            document.documentElement.style.setProperty('--scheme-background-color-secondary', this._colorScheme.backgroundSecondary);
            document.documentElement.style.setProperty('--scheme-foreground-color', this._colorScheme.foregroundColor);
        } else {
            document.documentElement.classList.remove('color-scheme-enabled');
            
            document.documentElement.style?.removeProperty('--main-color');
            document.documentElement.style?.removeProperty('--scheme-background-color-primary');
            document.documentElement.style?.removeProperty('--scheme-background-color-secondary');
            document.documentElement.style?.removeProperty('--scheme-foreground-color');
        }
    }

    private _update() {
        const localStorageColorScheme = localStorage.getItem(ColorSchemeRepository.LOCAL_STORAGE_KEY);
        if (localStorageColorScheme)
            this._colorScheme = JSON.parse(localStorageColorScheme);

        this._apply();
    }

    private _save() {
        localStorage.setItem(ColorSchemeRepository.LOCAL_STORAGE_KEY, JSON.stringify(this._colorScheme));
        this._apply();

        if (this._sharedLocalStorageIframes.length == 0)
            this._setupSharedLocalStorageIframes();

        this._sharedLocalStorageIframes.forEach(f => {
            f.contentWindow?.postMessage({ updatedColorScheme: this._colorScheme }, "*");
        });
    }

    private _setupSharedLocalstorageListener() {
        addEventListener("message", event => {
            const { updatedColorScheme } = event.data;
            if (updatedColorScheme){
                console.log(updatedColorScheme);
                localStorage.setItem(ColorSchemeRepository.LOCAL_STORAGE_KEY, JSON.stringify(updatedColorScheme));
                this._update();
            }
        }, false);
    }

    private _setupSharedLocalStorageIframes() {
        ColorSchemeRepository.SHARED_LOCAL_STORAGE_IFRAME_PAGES.forEach(p => {
            const iframe = document.createElement("iframe");
            iframe.src = p;
            iframe.style.setProperty('display', 'none');

            document.documentElement.appendChild(iframe);
            this._sharedLocalStorageIframes.push(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.postMessage({ updatedColorScheme: this._colorScheme }, "*");
            }
        });
    }

}