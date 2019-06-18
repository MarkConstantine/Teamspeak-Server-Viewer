'use strict';

class TsClient {
    constructor(clid, client_nickname, cid) {
        this.clid = clid;
        this.client_nickname = client_nickname;
        this.cid = cid;
    }
}

module.exports = TsClient;