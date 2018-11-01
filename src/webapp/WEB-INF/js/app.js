Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.util.*',
    'Ext.tip.QuickTipManager',
    'Ext.toolbar.TextItem',
    'Ext.form.field.Checkbox',
    'Ext.form.field.Text',
    'Ext.ux.statusbar.StatusBar'
]);
Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');

//модель
Ext.define('Citizen', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'name', 'lastName','birthDate','homeAddress',
        'documentNumber', 'documentType','documentCreatedDate', 'documentExpiredDate'
    ],
    /*валидация данных*/
    validations: [{
        type: 'length',
        field: 'name',
        min: 1
    }, {
        type: 'length',
        field: 'lastName',
        min: 1
    }]
});

//панель с возможностью поиска
Ext.define('Ext.ux.LiveSearchGridPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.toolbar.TextItem',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text',
        'Ext.ux.statusbar.StatusBar'
    ],

    /**
     * @private
     * search value initialization
     */
    searchValue: null,

    /**
     * @private
     * The row indexes where matching strings are found. (used by previous and next buttons)
     */
    indexes: [],

    /**
     * @private
     * The row index of the first search, it could change if next or previous buttons are used.
     */
    currentIndex: null,

    /**
     * @private
     * The generated regular expression used for searching.
     */
    searchRegExp: null,

    /**
     * @private
     * Case sensitive mode.
     */
    caseSensitive: false,

    /**
     * @private
     * Regular expression mode.
     */
    regExpMode: false,

    /**
     * @cfg {String} matchCls
     * The matched string css classe.
     */
    matchCls: 'x-livesearch-match',

    defaultStatusText: 'Nothing Found',

    // Component initialization override: adds the top and bottom toolbars and setup headers renderer.
    initComponent: function() {
        var me = this;
        me.tbar = ['Search',{
            xtype: 'textfield',
            name: 'searchField',
            hideLabel: true,
            width: 200,
            listeners: {
                change: {
                    fn: me.onTextFieldChange,
                    scope: this,
                    buffer: 500
                }
            }
        }, {
            xtype: 'button',
            text: '&lt;',
            tooltip: 'Find Previous Row',
            handler: me.onPreviousClick,
            scope: me
        },{
            xtype: 'button',
            text: '&gt;',
            tooltip: 'Find Next Row',
            handler: me.onNextClick,
            scope: me
        }, '-', {
            xtype: 'checkbox',
            hideLabel: true,
            margin: '0 0 0 4px',
            handler: me.regExpToggle,
            scope: me
        }, 'Regular expression', {
            xtype: 'checkbox',
            hideLabel: true,
            margin: '0 0 0 4px',
            handler: me.caseSensitiveToggle,
            scope: me
        }, 'Case sensitive'];

        me.bbar = Ext.create('Ext.ux.StatusBar', {
            defaultText: me.defaultStatusText,
            name: 'searchStatusBar'
        });

        me.callParent(arguments);
    },

    // afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input
    afterRender: function() {
        var me = this;
        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
        me.statusBar = me.down('statusbar[name=searchStatusBar]');
    },
    // detects html tag
    tagsRe: /<[^>]*>/gm,

    // DEL ASCII code
    tagsProtect: '\x0f',

    // detects regexp reserved word
    regExpProtect: /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,

    /**
     * In normal mode it returns the value with protected regexp characters.
     * In regular expression mode it returns the raw value except if the regexp is invalid.
     * @return {String} The value to process or null if the textfield value is blank or invalid.
     * @private
     */
    getSearchValue: function() {
        var me = this,
            value = me.textField.getValue();

        if (value === '') {
            return null;
        }
        if (!me.regExpMode) {
            value = value.replace(me.regExpProtect, function(m) {
                return '\\' + m;
            });
        } else {
            try {
                new RegExp(value);
            } catch (error) {
                me.statusBar.setStatus({
                    text: error.message,
                    iconCls: 'x-status-error'
                });
                return null;
            }
            // this is stupid
            if (value === '^' || value === '$') {
                return null;
            }
        }

        return value;
    },

    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @private
     */
    onTextFieldChange: function() {
        var me = this,
            count = 0;

        me.view.refresh();
        // reset the statusbar
        me.statusBar.setStatus({
            text: me.defaultStatusText,
            iconCls: ''
        });

        me.searchValue = me.getSearchValue();
        me.indexes = [];
        me.currentIndex = null;

        if (me.searchValue !== null) {
            me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));


            me.store.each(function(record, idx) {
                var td = Ext.fly(me.view.getNode(idx)).down('td'),
                    cell, matches, cellHTML;
                while(td) {
                    cell = td.down('.x-grid-cell-inner');
                    matches = cell.dom.innerHTML.match(me.tagsRe);
                    cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);

                    // populate indexes array, set currentIndex, and replace wrap matched string in a span
                    cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                        count += 1;
                        if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                            me.indexes.push(idx);
                        }
                        if (me.currentIndex === null) {
                            me.currentIndex = idx;
                        }
                        return '<span class="' + me.matchCls + '">' + m + '</span>';
                    });
                    // restore protected tags
                    Ext.each(matches, function(match) {
                        cellHTML = cellHTML.replace(me.tagsProtect, match);
                    });
                    // update cell html
                    cell.dom.innerHTML = cellHTML;
                    td = td.next();
                }
            }, me);

            // results found
            if (me.currentIndex !== null) {
                me.getSelectionModel().select(me.currentIndex);
                me.statusBar.setStatus({
                    text: count + ' matche(s) found.',
                    iconCls: 'x-status-valid'
                });
            }
        }

        // no results found
        if (me.currentIndex === null) {
            me.getSelectionModel().deselectAll();
        }

        // force textfield focus
        me.textField.focus();
    },

    /**
     * Selects the previous row containing a match.
     * @private
     */
    onPreviousClick: function() {
        var me = this,
            idx;

        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
            me.getSelectionModel().select(me.currentIndex);
        }
    },

    /**
     * Selects the next row containing a match.
     * @private
     */
    onNextClick: function() {
        var me = this,
            idx;

        if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
            me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
            me.getSelectionModel().select(me.currentIndex);
        }
    },

    /**
     * Switch to case sensitive mode.
     * @private
     */
    caseSensitiveToggle: function(checkbox, checked) {
        this.caseSensitive = checked;
        this.onTextFieldChange();
    },

    /**
     * Switch to regular expression mode
     * @private
     */
    regExpToggle: function(checkbox, checked) {
        this.regExpMode = checked;
        this.onTextFieldChange();
    }
});

Ext.onReady(function () {
    Ext.QuickTips.init();

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    function change(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    }

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    function pctChange(val){
        if(val > 0){
            return '<span style="color:green;">' + val + '%</span>';
        }else if(val < 0){
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    }

    var store = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'Citizen',
        proxy: {
            type: 'rest',
            url: 'citizens',
            format: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            reader: {
                type: 'json',
                root: 'data'
            },
            writer: {
                type: 'json'
            },
            api: {
                create: 'citizens/create/',
                read: '',
                update: 'citizens/edit/',
                destroy: 'citizens/delete/'
            }
        }
    });
    var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');

    // создаем панель CRUD и поиск, проблема с отображением даты, Js не может распарсить строку
    var grid=Ext.create('Ext.ux.LiveSearchGridPanel', {
        store: store,
        columnLines: true,
        frame: true,
        columns: [{
            text: 'ID',
            width: 40,
            sortable: true,
            dataIndex: 'id'
        }, {
            text: 'Name',
            flex: 1,
            width: 80,
            sortable: true,
            dataIndex: 'name',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'LastName',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'lastName',
            field: {
                xtype: 'textfield'
            }
        }, {
            header:'Birthday',
            xtype:'datecolumn',
            width: 100,
            sortable:true,
            dataIndex:'birthDate',
            formatter: 'date',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                format: 'm/d/Y'
            }
        }, {
            header: 'Address',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'homeAddress',
            field: {
                xtype: 'textfield'
            }
        },{
            header: 'Doc No',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'documentNumber',
            field: {
                xtype: 'textfield'
            }
        },{
            header: 'Doc Type',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'documentType',
            field: {
                xtype: 'textfield'
            }
        },{
            header: 'Doc Create',
            xtype:'datecolumn',
            width: 100,
            sortable:true,
            dataIndex:'documentCreatedDate',
            formatter: 'date',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                format: 'm/d/Y'
            }
        },{
            header: 'Doc Expire',
            xtype:'datecolumn',
            width: 100,
            dataIndex: 'documentExpiredDate',
            formatter: 'date',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                format: 'm/d/Y'
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: 'Add',
                iconCls: 'icon-add',
                handler: function () {
                    // empty record
                    store.insert(0, new Citizen());
                    rowEditing.startEdit(0, 0);
                }
            }, '-', {
                text: 'Delete',
                iconCls: 'icon-delete',
                handler: function () {
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        store.remove(selection);
                    }
                }
            }]
        }],
        height: 400,
        width: 900,
        title: 'Live Search Citizens',
        plugins: [rowEditing],
        renderTo: document.body,
        viewConfig: {
            stripeRows: true
        }
    });

    /*Панель таблица без возможности поиска CRUD*/
    /*
    var grid = Ext.create('Ext.grid.Panel', {
        renderTo: document.body,
        plugins: [rowEditing],
        width: 900,
        height: 400,
        frame: true,
        title: 'Citizens',
        store: store,
        columns: [{
            text: 'ID',
            width: 40,
            sortable: true,
            dataIndex: 'id'
        }, {
            text: 'Name',
            flex: 1,
            width: 80,
            sortable: true,
            dataIndex: 'name',
            field: {
                xtype: 'textfield'
            }
        }, {
            header: 'LastName',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'lastName',
            field: {
                xtype: 'textfield'
            }
        }, {
            header:'Birthday',
            xtype:'datecolumn',
            width: 90,
            sortable:true,
            dataIndex:'birthDate',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                format: 'm/d/Y'
            }
        }, {
            header: 'Address',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'homeAddress',
            field: {
                xtype: 'textfield'
            }
        },{
            header: 'Doc No',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'documentNumber',
            field: {
                xtype: 'textfield'
            }
        },{
            header: 'Doc Type',
            flex:1,
            width: 80,
            sortable: true,
            dataIndex: 'documentType',
            field: {
                xtype: 'textfield'
            }
        },{
            header: 'Doc Create',
            xtype:'datecolumn',
            width: 90,
            sortable:true,
            dataIndex:'documentCreatedDate',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                format: 'm/d/Y'
            }
        },{
            header: 'Doc Expire',
            xtype:'datecolumn',
            width: 90,
            dataIndex: 'documentExpiredDate',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                format: 'm/d/Y'
            }
        }],
        dockedItems: [{
            xtype: 'toolbar',
            items: [{
                text: 'Add',
                iconCls: 'icon-add',
                handler: function () {
                    // empty record
                    store.insert(0, new Citizen());
                    rowEditing.startEdit(0, 0);
                }
            }, '-', {
                text: 'Delete',
                iconCls: 'icon-delete',
                handler: function () {
                    var selection = grid.getView().getSelectionModel().getSelection()[0];
                    if (selection) {
                        store.remove(selection);
                    }
                }
            }]
        }]
    });*/
});