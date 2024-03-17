const src = "./assets/songs/"


export default class Sound {
    static soundList = [];

    constructor(filename, volume, loop) {
        this.audio = new Audio(src + filename);
        volume ? this.audio.volume = volume : '';
        loop ? this.audio.loop = loop : '';

        this.audio.addEventListener('ended', () => {
            this.removeFromList();
        });
        Sound.soundList.push(this);
    }
    playSound() {
        let soundEnabled = localStorage.getItem("soundEnabled") === "true";
        this.audio.play()
        this.audio.muted = true;

        if (soundEnabled) {
            this.audio.muted = false;
        }
    }
    pauseSound() {
        if(this.audio.loop) {
            this.audio.pause()
        } else {
            console.log("mute")
            this.audio.muted = true;
        }
    }
    removeFromList() { 
        const index = Sound.soundList.indexOf(this);
        if (index !== -1) {
            Sound.soundList.splice(index, 1);
        }
    }
    static pauseAllSound() {
        console.log(Sound.soundList)
        Sound.soundList.forEach(sound => {
            sound.pauseSound();
        });
    }
    static playAllSound() {
        console.log(Sound.soundList)
        Sound.soundList.forEach(sound => {
     
            if(sound.audio.loop) {
                sound.audio.play()
            } else {
                console.log("mute")
                sound.audio.muted = false;
            }
        });
    }
}
