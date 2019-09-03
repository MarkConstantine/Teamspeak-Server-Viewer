'use strict';

class TsClient {
    constructor(clid, client_nickname, cid) {
        this.clid = clid;
        this.client_nickname = client_nickname;
        this.cid = cid;
        this.client_input_muted = false;
        this.client_output_muted = false;
    }
}

module.exports = TsClient;