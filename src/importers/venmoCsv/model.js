
// RawVenmoCsvRow[] -> VenmoCsv

export class RawVenmoCsvRow {
    /**
     * @param {string} id ID
     * @param {string} datetime Datetime
     * @param {string} type Type
     * @param {string} status Status
     * @param {string} note Note
     * @param {string} from From
     * @param {string} to To
     * @param {string} amountTotal Amount (total)
     * @param {string} amountTip Amount (tip)
     * @param {string} amountTax Amount (tax)
     * @param {string} amountFee Amount (fee)
     * @param {string} taxRate Tax Rate
     * @param {string} taxExempt Tax Exempt
     * @param {string} fundingSource Funding Source
     * @param {string} destination Destination
     * @param {string} beginningBalance Beginning Balance
     * @param {string} endingBalance Ending Balance
     * @param {string} statementPeriodVenmoFees Statement Period Venmo Fees
     * @param {string} terminalLocation Terminal Location
     * @param {string} yearToDateVenmoFees Year to Date Venmo Fees
     * @param {string} disclaimer Disclaimer
     */
    constructor(id, datetime, type, status, note, from, to, amountTotal, amountTip, amountTax, amountFee, taxRate, taxExempt, fundingSource, destination, beginningBalance, endingBalance, statementPeriodVenmoFees, terminalLocation, yearToDateVenmoFees, disclaimer) {
        this.id = id;
        this.datetime = datetime;
        this.type = type;
        this.status = status;
        this.note = note;
        this.from = from;
        this.to = to;
        this.amountTotal = amountTotal;
        this.amountTip = amountTip;
        this.amountTax = amountTax;
        this.amountFee = amountFee;
        this.taxRate = taxRate;
        this.taxExempt = taxExempt;
        this.fundingSource = fundingSource;
        this.destination = destination;
        this.beginningBalance = beginningBalance;
        this.endingBalance = endingBalance;
        this.statementPeriodVenmoFees = statementPeriodVenmoFees;
        this.terminalLocation = terminalLocation;
        this.yearToDateVenmoFees = yearToDateVenmoFees;
        this.disclaimer = disclaimer;
    }
}

export class VenmoCsvTypeEnum {
    static payment = new VenmoCsvTypeEnum('Payment');
    static charge = new VenmoCsvTypeEnum('Charge');
    static standardTransfer = new VenmoCsvTypeEnum("Standard Transfer");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `VenmoCsvTypeEnum.${this.name}`;
    }
}

export class VenmoCsvStatusEnum {
    static complete = new VenmoCsvTypeEnum('Complete');
    static issued = new VenmoCsvTypeEnum('Issued');

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `VenmoCsvStatusEnum.${this.name}`;
    }
}

export class VenmoCsvRow {
    /**
     * @param {string} id 
     * @param {Date} datetime 
     * @param {VenmoCsvTypeEnum} type 
     * @param {VenmoCsvStatusEnum} status 
     * @param {string} note 
     * @param {string} from 
     * @param {string} to 
     * @param {bigint} amountTotal 
     * @param {bigint} amountTip 
     * @param {bigint} amountTax 
     * @param {bigint} amountFee 
     * @param {bigint} taxRate 
     * @param {boolean} taxExempt 
     * @param {string} fundingSource 
     * @param {string} destination 
     * @param {string} terminalLocation 
     */
    constructor(id, datetime, type, status, note, from, to, amountTotal, amountTip, amountTax, amountFee, taxRate, taxExempt, fundingSource, destination, terminalLocation) {
        this.id = id;
        this.datetime = datetime;
        this.type = type;
        this.status = status;
        this.note = note;
        this.from = from;
        this.to = to;
        this.amountTotal = amountTotal;
        this.amountTip = amountTip;
        this.amountTax = amountTax;
        this.amountFee = amountFee;
        this.taxRate = taxRate;
        this.taxExempt = taxExempt;
        this.fundingSource = fundingSource;
        this.destination = destination;
        this.terminalLocation = terminalLocation;
    }
}

export class VenmoCsv {
    constructor(beginningBalance, endingBalance, statementPeriodVenmoFees, yearToDateVenmoFees, disclaimer, venmoCsvRowList) {
        this.beginningBalance = beginningBalance;
        this.endingBalance = endingBalance;
        this.statementPeriodVenmoFees = statementPeriodVenmoFees;
        this.yearToDateVenmoFees = yearToDateVenmoFees;
        this.disclaimer = disclaimer;
        this.venmoCsvRowList = venmoCsvRowList;
    }
}
