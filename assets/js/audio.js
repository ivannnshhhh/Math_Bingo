// SoundManager class for handling audio playback
class SoundManager {
    constructor() {
        this.volume = 0.5; // Default volume (0-1)
        this.muted = false;
        // Placeholder audio paths - replace with actual sound files
        this.sounds = {
            shakerClick: 'assets/sounds/click.mp3', // Replace with actual click sound file
            shakerShake: 'assets/sounds/shakingg.mp3', // Replace with actual shake sound file
            popupAppear: 'assets/sounds/pop-up.mp3'  // Replace with actual popup sound file
        };
    }

    // Set volume (0-1)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Set muted state
    setMuted(muted) {
        this.muted = muted;
    }

    // Play shaker click sound
    playShakerClick() {
        if (this.muted) return;
        const audio = new Audio(this.sounds.shakerClick);
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    // Play shaker shake sound (plays once during shake animation)
    playShakerShake() {
        if (this.muted) return;
        const audio = new Audio(this.sounds.shakerShake);
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }

    // Play popup appear sound
    playPopupAppear() {
        if (this.muted) return;
        const audio = new Audio(this.sounds.popupAppear);
        audio.volume = this.volume;
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Create a global instance
const soundManager = new SoundManager();