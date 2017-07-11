/**
 * 范围：
 *（1）匹配等于指定键值的记录：var range = IDBKeyRange.only(指定键值)
 *（2）匹配小于指定键值的记录：var range = IDBKeyRange.lowerBound(指定键值, 是否不包括指定键值)
 *（3）匹配大于指定键值的记录：var range = IDBKeyRange.upperBound(指定键值, 是否不包括指定键值)
 *（4）匹配指定范围内的记录：var range = IDBKeyRange.bound(下限键值，上限键值，是否不包括下限键值，是否不包括上限键值
 */
  例如：
// 只取得当前索引的值为110的数据  
IDBKeyRange.only("110");  
// 只取得当前索引的值大于110，并且不包括110的数据  
IDBKeyRange.lowerBound("110", true);  
// 只取得当前索引的值小于110，并且包括110的数据  
IDBKeyRange.upperBound("110", false);  
// 取得当前索引的值介于110和120之间，并且包括110，但不包括120的数据  
IDBKeyRange.bound("110", "120", false, true);  

/**
 * 顺序参数：
 * IDBCursor.NEXT，顺序循环；
 * IDBCursor.NEXT_NO_DUPLICATE，顺序循环且键值不重复；
 * IDBCursor.PREV，倒序循环；
 * IDBCursor.PREV _NO_DUPLICATE，倒序循环且键值不重复。
 */

function byCursorGetForRangeAndSort(mydb){
    var transaction = mydb.transaction('students','readwrite');
    transaction.oncomplete = function(event) {};
    transaction.onerror = function(event) {};
    transaction.onabort = function(event){};
    var objStore = transaction.objectStore('students');
    var range = IDBKeyRange.bound("110", "113", false, true);   //范围
    var request=objStore.openCursor(range,             //范围（可以为null或省略不写）
                                    IDBCursor.NEXT);    //游标顺序循环(可以省略不写)
    request.onsuccess = function(e){
        var cursor1 = e.target.result;
        if(cursor1){
            alert(cursor1.value.name);
            cursor1.continue();
        }else {
            alert('遍历完成');
        }
    }
}