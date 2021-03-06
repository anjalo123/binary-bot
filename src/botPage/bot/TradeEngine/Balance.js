import { roundBalance } from '../../common/tools';
import { info } from '../broadcast';
import { doUntilDone } from '../tools';

let balance = 0;
let balanceStr = '';

export default Engine =>
    class Balance extends Engine {
        subscribeToBalance() {
            doUntilDone(() => this.api.subscribeToBalance()).catch(e => this.$scope.observer.emit('Error', e));

            return new Promise(r => {
                this.balancePromise = r;
            });
        }
        observeBalance() {
            this.listen('balance', r => {
                const { balance: { balance: b, currency } } = r;

                balance = roundBalance({ currency, balance: b });
                balanceStr = `${balance} ${currency}`;

                this.balancePromise();
                info({ accountID: this.accountInfo.loginid, balance: balanceStr });
            });
        }
        // eslint-disable-next-line class-methods-use-this
        getBalance(type) {
            return type === 'STR' ? balanceStr : Number(balance);
        }
    };
