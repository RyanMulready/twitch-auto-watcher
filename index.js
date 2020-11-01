// ==UserScript==
// @name Twitch Auto  Watch
// @version 0.0.1
// @author Ryan Mulready
// @description Auto watch friends
// @match https://www.twitch.tv/friends*
// @license MIT
// @grant none
// @namespace
// ==/UserScript==
const twitchAutoWatch = {
    options: {
        debug: true, // Print console statements
        refreshTimeout: 1 * 60000, // 1 Minute
        pageTimeout: 5000, // 5 seconds
    },
    droneManager(friend) {
        // If the friend is streaming and our window is not open already
        if (friend.streaming && !friend.open) {
            window.open(friend.url, friend.name, '', true);
            localStorage.setItem(friend.name, true);
            if (this.options.debug) {
                console.log(`[👀] Drone Created: ${friend.name}`);
            }
        } else if (!friend.streaming && friend.open) {
            const openWindow = window.open(friend.url, friend.name, '', true);
            openWindow.window.close();
            localStorage.setItem(friend.name, false);
            if (this.options.debug) {
                console.log(`[👀] Drone Killed: ${friend.name}`);
            }
        } else if (this.options.debug) {
            console.log(`[👀] Drone Ignored: ${friend.name}`);
        }
    },
    checkForOnlineFriends() {
        const friendsList = document.querySelectorAll('.tw-justify-content-center .tw-mg-b-2 .info');
        if (this.options.debug) {
            console.log('[👀] Friends NodeList:', friendsList);
        }

        Array.from(friendsList).forEach(friendNode => {
            const friend = {
                url: friendNode.querySelector('.tw-interactive').getAttribute('href'),
                name: friendNode.querySelector('.tw-c-text-overlay').getAttribute('title'),
                streaming: friendNode.querySelector('[data-a-target="presence-text"]').innerText.includes('streaming'),
            };
            friend.open = localStorage.getItem(friend.name) === 'true';

            if (this.options.debug) {
                console.log(`[👀] Friend Found: ${friend.name}`, friend);
            }
            this.droneManager(friend);
        });
    },
    refreshTimer() {
        if (this.options.debug) {
            console.log(`[👀] Timer Set for ${this.options.refreshTimeout} milliseconds`);
        }
        // Refresh page after X minutes, init will be triggered again
        setTimeout(() => window.location.reload(), this.options.refreshTimeout);
    },
    init() {
        // Delay a bit on loading in order for twitch to finish loading
        // TODO: Could use mutation observer and look for updates to avoid timeout
        const self = this;
        setTimeout(() => {
            if (self.options.debug) {
                console.log('[👀] Twitch Auto Watcher Started');
            }
            self.checkForOnlineFriends();
            self.refreshTimer();
        }, self.options.pageTimeout);
    },
};

twitchAutoWatch.init();
