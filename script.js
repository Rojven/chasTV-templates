const onDOMReady = () => {
    'use strict';

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    //theme toggler selectors
    const togglers = $$('.toggler');
    const togglerBalls = $$('.toggler__ball');
    const root = $(':root');

    //cookie popup selectors
    const cookiePopup = $('.cookie-popup');
    const cookiePopupButton = $('.cookie-popup__button');

    //card hover selectors
    const channelCards = $$('.card_channels');
    const hoveredItems = $$('.card__onhover');

    //radio player selectors
    const playButton = $('#playPause');
    const player = $('#radioPlayer');
    const playerVolumeBar = $('#volumeBar');
    const volumeIcon = $('#volumeIcon');
    let isPlaying = true;

    //localStorage shortcuts
    const setter = (name, value) => localStorage.setItem(name, value);
    const getter = (name) => localStorage.getItem(name);

    //error messaging function
    const errorMessaging = (err) => {
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "dev.chas.tv") {
            console.log("Player error:", err.message);
        }
    };

    // theme toggler function
    const mainThemeTogglerFunc = () => {

        const isDark = () => {
            return getter('dark-mode');
        };
        
        const toggleRootClass = () => {
            root.classList.toggle('dark');
        };
        
        const toggleLocalStorageItem = () => {
            if (isDark()) {
                localStorage.removeItem('dark-mode');
            } else {
                setter('dark-mode', 'set');
            }
        };
        
        if (isDark()) {
            toggleRootClass();
        }
    
        const onThemeToggle = () => {

            togglers.forEach((toggler, i) => {

                if (isDark()) {
                    togglerBalls[i].classList.add('toggler__ball_clicked');
                }

                toggler.addEventListener('click', () => {
                    toggleLocalStorageItem();
                    toggleRootClass();
                    togglerBalls[i].classList.toggle('toggler__ball_clicked');
                });
            });
        };

        onThemeToggle();
    };

    //cookie popup function
    const onPopupShown = () => {

        if (getter('cookiePopup') !== 'hidden') {
            cookiePopup.classList.remove('cookie-popup_hidden');
        }

        cookiePopupButton.addEventListener('click', () => {
            cookiePopup.classList.add('cookie-popup_hidden');
            setter('cookiePopup', 'hidden');
        });
    };

    //card hover function
    const onCardHover = () => {

        channelCards.forEach((card, i) => {

            card.addEventListener('mouseover', () => {
                hoveredItems[i].classList.add('card__onhover_active');
            });

            card.addEventListener('mouseleave', () => {
                hoveredItems[i].classList.remove('card__onhover_active');
            });
        });
    };

    //radio player function
    const mainRadioPlayerFunc = () => {

        const iOS = () => {
            return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || 
            (navigator.userAgent.includes("Mac") && "ontouchend" in document);
        };

        if(iOS()) {
            volumeIcon.style.display = 'none';
            playerVolumeBar.style.display = 'none';
        }
    
        const togglePlay = () => {

            try {

                if(player.src.substring(player.src.lastIndexOf('.')+1, player.src.length) === 'm3u8') {
                    const hls = new Hls();
                    hls.loadSource(player.src);
                    hls.attachMedia(player);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                        if(player.play()) {
                            isPlaying = false;
                            playButton.classList.add('fa-play');
                        }
                    });
                }

                if(player.play()) {
                    isPlaying = false;
                    playButton.classList.add('fa-play');
                }
    
                playButton.addEventListener('click', () => {
                    isPlaying ? player.pause() : player.play();
                });
                
                player.onplaying = () => {
                    isPlaying = true;
                    playButton.classList.add('fa-pause');
                    playButton.classList.remove('fa-play');
                };
    
                player.onpause = () => {
                    isPlaying = false;
                    playButton.classList.add('fa-play');
                    playButton.classList.remove('fa-pause');
                };
    
                volumeIcon.classList.add('fa-volume-high');  
            } catch (err) {
                errorMessaging(err);
            }   
        };
        
        const setVolume = (myVolume) => {

            player.volume = myVolume / 100;
            playerVolumeBar.value = myVolume;

            if (player.volume === 0) {
                volumeIcon.classList.remove('fa-volume-high');
                volumeIcon.classList.add('fa-volume-xmark');
            } else {
                volumeIcon.classList.remove('fa-volume-xmark'); 
                volumeIcon.classList.add('fa-volume-high');
            }
        };

        const onVolumeChange = () => {
            try {
                
                let defaultVolume = 50;

                if (!getter('volume')) {
                    setter('volume', defaultVolume);
                }
                setVolume(getter('volume'));

                playerVolumeBar.addEventListener('change', () => {
                    setVolume(playerVolumeBar.value);
                    setter('volume', playerVolumeBar.value); 
                });
                
                volumeIcon.addEventListener('click', () => {
                    if(player.volume === 0) {
                        setter('volume', getter('tempVolume'));
                        setVolume(getter('volume'));
                    } else {
                        setter('tempVolume', getter('volume'));
                        setter('volume', 0);
                        setVolume(getter('volume'));
                    }
                });
            } catch (err) {
                errorMessaging(err);
            }
        };        

        togglePlay();
        onVolumeChange();
    };

    mainThemeTogglerFunc();
    onPopupShown();
    onCardHover();
    mainRadioPlayerFunc();

};

window.addEventListener('DOMContentLoaded', onDOMReady);
