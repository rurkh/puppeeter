import FileService from './FileService';

class PuppetService {
    constructor() {
        if (PuppetService.instance) {
            return PuppetService.instance;
        }

        this.puppeteer = require('puppeteer');
        this.amountOfFriendsIndex = 4;
        this.siteInstance = 'https://facebook.com';
        this.toProfileButton = 'a._2s25._606w';
        this.friendsListDivSelector = 'ul.uiList._323_._509-._4ki';
        this.loginSelector = 'input#email';
        this.passwordSelector = 'input#pass';
        this.submitLogin = '#u_0_2';
        this.requestIp = require('request-ip');
        PuppetService.instance = this;
    }

    async openFacebookWithCredentails(login, password, oldIp, req) {
        try {
            const browser = await this.puppeteer.launch();
            const page = await browser.newPage();
            let ip;
            if (oldIp) {
                ip = oldIp;
                const cookies = await FileService.readData();
                await page.setCookie(...cookies);
            } else {
                ip = this.requestIp.getClientIp(req);
            }

            await page.setViewport({width: 1600, height: 920})
            await page.goto(this.siteInstance);
            const loggedIn = await page.$(this.toProfileButton);
            if (!loggedIn) {
                await page.type(this.loginSelector, login);
                await page.type(this.passwordSelector, password);
                await page.click(this.submitLogin);
                await page.waitForSelector(this.toProfileButton);
                const cookies = await page.cookies();
                await FileService.writeData(cookies, ip);
            }
            await page.click(this.toProfileButton);
            await page.waitForSelector(this.friendsListDivSelector);
            const hrefs = await page.evaluate(() => {
                const anchors = document.querySelectorAll('a._44ws');
                return [].map.call(anchors, a => a.href);
            });
            await this.getScreen(hrefs, page);
            return true;
        } catch (e) {
            console.log(e);
            return false;

        }

    }

    async getScreen(links, page) {
        try {
            for (let i = 0; i < links.length && i <= this.amountOfFriendsIndex; i++) {
                const link = links[i];
                await page.goto(link);
                await page.waitFor(() => !!document.querySelector('.FriendRequestAdd.addButton'));
                await page.screenshot({path: `screens/suggestion${i}.jpg`});
            }
            return true;
        } catch (e) {
            console.log('screen', e);
            return false;
        }

    }

}

export default new PuppetService();