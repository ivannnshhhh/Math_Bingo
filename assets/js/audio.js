class SoundManager {
    constructor() {
        this.volume = 0.5;
        this.muted = false;
        
        this.sounds = {
            shakerClick: 'assets/sounds/click.mp3',
            shakerShake: 'assets/sounds/shakingg.mp3',
            popupAppear: 'assets/sounds/pop-up.mp3'
        };
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    setMuted(muted) {
        this.muted = muted;
    }

    playShakerClick() {
        if (this.muted) return;
        const audio = new Audio(this.sounds.shakerClick);
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    playShakerShake() {
        if (this.muted) return;
        const audio = new Audio(this.sounds.shakerShake);
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    playPopupAppear() {
        if (this.muted) return;
        const audio = new Audio(this.sounds.popupAppear);
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}


const soundManager = new SoundManager();
