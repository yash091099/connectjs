import { LitElement } from 'lit';
import '../../components/wui-text/index.js';
import type { TransactionType } from '../../utils/TypeUtil.js';
import '../wui-transaction-visual/index.js';
export declare class WuiListTransaction extends LitElement {
    static styles: import("lit").CSSResult[];
    type: TransactionType;
    disabled: boolean;
    imageSrc: string;
    date: Date;
    transactionDetail: string;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'wui-list-transaction': WuiListTransaction;
    }
}
