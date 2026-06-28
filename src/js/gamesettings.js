export const GameSettings = {
    musicVolume: 0.5,
    sfxVolume: 0.5,

    load() {
        const settings = JSON.parse(localStorage.getItem('gameSettings'));
        if (settings) {
            this.musicVolume = settings.musicVolume ?? 0.5;
            this.sfxVolume = settings.sfxVolume ?? 0.5;
        }
    },

    save() {
        localStorage.setItem('gameSettings', JSON.stringify({
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume
        }));
    }
};