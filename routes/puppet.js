const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
import  PuppetService  from '../services/PuppetService';
import  FileService  from '../services/FileService';

router.get('/',  async(req, res, next) => {

	try {
        const ip = await FileService.findIp(requestIp.getClientIp(req));
        let { login, password } = req.query;
        if ((!login || !password) && !ip) {
            res.send(false);
            return;
        }
       await PuppetService.openFacebookWithCredentails(login, password, ip, req);
       res.send(true);
        return;
    } catch(e) {
	    console.log(e);
        res.send(false);
    return;
    }




});

module.exports = router;
