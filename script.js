window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // theme toggler
    const togglers = document.querySelectorAll('.toggler');
    const togglerBalls = document.querySelectorAll('.toggler__ball');
    const root = document.querySelector(':root');

    const isLight = () => {
        return localStorage.getItem("light-mode");
    }
      
    const toggleRootClass = () => {
        root.classList.toggle('light');
    }
      
    const toggleLocalStorageItem = () => {
        if (isLight()) {
            localStorage.removeItem('light-mode');
        } else {
            localStorage.setItem('light-mode', 'set');
        }
    }
      
    if (isLight()) {
        toggleRootClass();
    }
    
    const onThemeToggle = () => { 
        togglers.forEach((toggler, i) => {
            if (!isLight()) {
                togglerBalls[i].classList.add('toggler__ball_clicked');
            }
            toggler.addEventListener('click', () => {
                toggleLocalStorageItem();
                toggleRootClass();
                togglerBalls[i].classList.toggle('toggler__ball_clicked');
            })
        }) 
    }
    onThemeToggle();

    //cookie popup
    const cookiePopup = document.querySelector('.cookie-popup');
    const cookiePopupButton = document.querySelector('.cookie-popup__button');

    const onPopupShown = () => {
        if (localStorage.getItem('cookiePopup') === 'hidden') {
            cookiePopup.classList.add('cookie-popup_hidden');
        }
        cookiePopupButton.addEventListener('click', () => {
            cookiePopup.classList.add('cookie-popup_hidden');
            localStorage.setItem('cookiePopup', 'hidden');
        })
    }
    onPopupShown();

    // channels card hover
    const channelCards = document.querySelectorAll('.card_channels');
    const hoveredItems = document.querySelectorAll('.card__onhover');

    const onCardHover = () => {
        try {
            channelCards.forEach((card, i) => {
                card.addEventListener('mouseover', () => {
                    hoveredItems[i].classList.add('card__onhover_active');
                });
                card.addEventListener('mouseleave', () => {
                    hoveredItems[i].classList.remove('card__onhover_active');
                })
            })
        } catch (error) {}
    }
    onCardHover();

    //active navLinks
    const navLinks = document.querySelectorAll('.header__link');
    const path = location.pathname;

    const onLinkActive = () => {
        try {
            if(path === '') return;
            navLinks.forEach((link) => {
                if(link.getAttribute('href').indexOf(path) !== -1) {
                    link.classList.add('header__link_active');
                } else {
                    link.classList.remove('header__link_active');
                }
            })
        } catch (error) {}
        
    }
    onLinkActive();

    //radio player
    const playButton = document.querySelector('#playPause');
    const player = document.querySelector('#radioPlayer');
    const playerVolumeBar = document.querySelector('#volumeBar');
    const volumeIcon = document.querySelector('#volumeIcon');
    let isPlaying = false;

    const togglePlay = () => {
        try {
            playButton.addEventListener('click', () => {
                isPlaying ? player.pause() : player.play();
                if(!isPlaying && playButton.classList.contains('fa-play')) {
                    playButton.classList.remove('fa-play');
                    playButton.classList.add('fa-pause')
                } else {
                    playButton.classList.remove('fa-pause');
                    playButton.classList.add('fa-play')
                }
            }) 
            player.onplaying = () => {
                isPlaying = true;
              };
            player.onpause = () => {
            isPlaying = false;
            }; 
            volumeIcon.classList.add('fa-volume-high'); 
        } catch (error) {}    
    }
    togglePlay();

    
    const setVolume = (myVolume) => {
        player.volume = myVolume;
        switch (myVolume) {
            case 1:
                volumeIcon.classList.remove('fa-volume-xmark') 
                volumeIcon.classList.add('fa-volume-high')   
                break;
            case 0:
                volumeIcon.classList.remove('fa-volume-high')
                volumeIcon.classList.add('fa-volume-xmark')   
                break;
            default:
                break;
        }
    }
    const onVolumeChange = () => {
        try {
            playerVolumeBar.addEventListener('change', (e) => {
                setVolume(playerVolumeBar.value / 100); 
            })
        } catch (error) {}  
    }
    onVolumeChange();
});