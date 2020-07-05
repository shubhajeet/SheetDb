function SheetDb(sid,sheetName)
{
    var sheet = SpreadsheetApp.openById(sid);
    var db = sheet.getSheetByName(sheetName);
    if (!db)
    {
        db = sheet.insertSheet(sheetName);
        db.appendRow(["rowId"]);
    }
    this.db = db;
}

SheetDb.prototype.getColumns = function()
{
    this.columns = this.db.getRange(1,1,1,this.db.getLastColumn());
    let columns = this.columns.getValues();
    return columns[0];
}

SheetDb.prototype.setColumns = function(cols)
{
    return this.db.getRange(1,1,1,cols.length).setValues([cols]);
}

SheetDb.prototype.resetIndex = function()
{
    if (this.db.getLastRow() == 1) return;
    let rowIds = [];
    for (let i=1; i < this.db.getLastRow(); i++)
    {
        rowIds.push([i]);
    }
    return this.db.getRange(2,1,this.db.getLastRow()-1,1).setValues(rowIds);
}

SheetDb.prototype.removeRowById = function(rowId)
{
    this.db.deleteRow(rowId+1);
    this.resetIndex();
}

SheetDb.prototype.removeRows = function(key)
{
    let data = this.get(key);
    for (let i=0; i < data.length; i++)
    {
        this.db.deleteRow(data[i][0]+1-i);
    }
    this.resetIndex();
}

SheetDb.prototype.setRowById = function(rowId,row)
{
    Logger.log(rowId);
    Logger.log(row);
    return this.db.getRange(rowId+1,1,1,row.length).setValues([row]);
}

SheetDb.prototype.getRowById = function(rowId)
{
    let data = this.db.getRange(rowId+1, 1, this.db.getLastRow(),1).getValues();
    return data[0];
}

SheetDb.prototype.getColumnByName = function(colName)
{
    let columns = this.getColumns();
    return this.getColumnById(columns.findIndex(col => col == colName));
}

SheetDb.prototype.getColumnById = function(colId)
{
    let data = this.db.getRange(2, colId+1, this.db.getLastRow()-1, 1 ).getValues();
    return data.reduce((agg,row) => { agg.push(row[0]); return agg;}, []);
}

SheetDb.prototype.toArray = function(data)
{
    var columns = this.getColumns();
    var row = new Array(columns.length);
    for (k in data)
    {
        let col = columns.findIndex(item => item == k);
        if ( col == -1 )
        {
            columns.push(k);
            this.setColumns(columns);
            row.push(data[k]);
        }
        else
        {
            row[col] = data[k];
        }
    }
    return row;
}

SheetDb.prototype.update = function(value,key)
{
    let row = this.toArray(value);
    let data = this.get(key);
    data.map( item => {
        Logger.log(row);
        for ( let i = 0; i < row.length; i++)
        {
            if ( row[i] != null )
            {
                item[i] = row[i];
            }
        }
        return this.setRowById(item[0],item);
    });
}

SheetDb.prototype.set = function(value,key=null)
{
    let row = this.toArray(value);
    if (key)
    {
        let data = this.get(key);
        data.map( item => { 
            row[0] = item[0];
            this.setRowById(item[0],row);
        });
    }
    else
    {
        let noOfRow = this.db.getLastRow();
        //Logger.log(noOfRow);
        row[0] = noOfRow;
        return this.db.appendRow(row);
    };
}

SheetDb.prototype.get = function(key=null)
{
    if (this.db.getLastRow() == 1) return [];
    var columns = this.getColumns();
    var data = this.db.getRange(2, 1,this.db.getLastRow()-1, this.db.getLastColumn()).getValues();
    if (key)
    {
        data = data.filter(item => {
            let condition = true;
            for (let k in key)
            {
                let colIndex = columns.findIndex(item => item == k);
                condition = (condition && (item[colIndex] == key[k]));
            }
            return condition;
        }
                          );
    }
    //Logger.log(data);
    return data;
}

SheetDb.prototype.toJson = function (data)
{
    let columns = this.getColumns();
    return data.reduce((agg,row) => {
        let rowData = {};
        for(let i=0; i < columns.length; i++) 
        {
            rowData[columns[i]] = row[i];
        }
        agg.push(rowData);
        return agg;
    },
                       []
                      );
}