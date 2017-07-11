var DBUtil = function(){
    this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB ||window.msIndexedDB;
    this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    this.con = null;
    this.db = null;
    this.name;
    this.tableName;
    this.version;
    this.cells;
    this.res;
    this.lastCursor;
}

DBUtil.prototype = {
    connect : function(options){
        var me = this;
        me.name = options.baseName;
        me.tableName = options.tableName;
        me.version = options.version || 1.0;
        me.cells = options.cells || [];

        //检查表有没有输入
        if(me.tableName == '' || me.tableName == undefined){
            console.log('No tableName!');
            return false;
        }
        if(me.cells == '' || me.cells == undefined){
            console.log('No cells!');
            return false;
        }
        //如果数据库存在就打开，如果数据库不存在就去新建
        me.con = me.indexedDB.open(me.name,me.version);
        me.con.onsuccess = function(e){
            me.db = e.target.result;
            console.log('connect db[' + me.name + '] success! version[' + me.db.version + ']');
        };
        me.con.onerror = function(e){
            console.log('connect db[' + me.name + '] failed!' + e.taeget.errorCode);
            console.dir(e.target);
        };

        //创建新数据库，或者数据库版本号被更改的时候触发onupgradeneeded事件，并执行回调函数
        me.con.onupgradeneeded = function(e){
            console.log('onupgradeneeded running……');
            var thisdb = e.target.result;
            console.log('Version update success!'+ e.oldVersion + '--->' + e.newVersion);
            //判断是否有这个表的存在
            if(!thisdb.objectStoreNames.contains(me.tableName)){
                console.log("db[name] not exisit [" + me.tableName + ']，beigin create table...' );
                //如果表格不存在，创建一个新的表（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
                var objectStore = thisdb.createObjectStore(me.tableName,{keyPath:'id',autoIncrement:true});
                //指定可以被索引的字段，unique字段是否唯一
                for(var i=0,len=me.cells.length;i<len;i++){
                    objectStore.createIndex(me.cells[i][0],me.cells[i][0],{unique:me.cells[i][1]});
                }
                console.log('table created success!')
            }
        };

        return me;
    },
    add : function(obj){
        var transaction = this.db.transaction(this.tableName,"readwrite");
        console.log(transaction);
        //事物回调函数的处理
        transaction.oncomplete = function(e){
             console.log("transaction complete!");
        }
        transaction.onerror = function(e){
            console.dir(e);
        }
        //通过事物得到一个objectStore对象
        var objectStore = transaction.objectStore(this.tableName);
        objectStore.add(obj);
        console.log('add data success!');
    },
        /**
         * [query description]
         * @param  {[type]} cell  [哪一字段]
         * @param  {[type]} val   [条件值]
         * @return {[type]}       [description]
         */
        query : function(cell,val,callback){
            var me = this;
            var transaction =this.db.transaction(this.tableName,'readwrite');
            transaction.oncomplete = function(e){
                console.log('transaction complete!');
            };
            transaction.onerror = function(e){
                console.dir(e);
            };
            //得到objectStore对象
            var objectStore = transaction.objectStore(this.tableName);

            // 通过索引查询
            // objectStore.index(cell).get(val).onsuccess = function(e){
            //     // me.res = e.target.result;
            //     var res = e.target.result;
            //     callback(res);
            // }

            //游标与索引相结合的查询，性能优化
            var boundKeyRange = this.IDBKeyRange.only(val); //生成一个辨识范围的Range对象
            objectStore.index(cell).openCursor(boundKeyRange).onsuccess = function(e){
                var cursor = e.target.result;
                if(!cursor){
                    console.log('No data!');
                    return;
                }
                var res = cursor.value;
                //利用回调函数，给外部提供值
                callback(res);
                //使游标下移，如果到最后娶不到值，返回undefined
                cursor.continue();
            }
        },
        deleteRow : function(key,callback){
            var transaction = this.db.transaction(this.tableName,"readwrite");
            transaction.oncomplete = function(e){
                console.log("transaction complete!");
            };

            transaction.onerror = function(e){
                console.dir(event);
            }
            //得到objectStore对象
            var objectStore = transaction.objectStore(this.tableName);
            //接收传过来的key值
            var removeKey = parseInt(key);
            //通过key值获取对象,在控制台打印
            var getRequest=objectStore.get(removeKey);
            getRequest.onsuccess=function(e){
                var result = getRequest.result;
                console.dir(result);
            };
            var request = objectStore.delete(removeKey);
            request.onsuccess = function(e){
                console.log("success delete record!");
                callback(true);
            };
            request.onerror = function(e){
                console.log("Error delete record:",e);
                callback(false);
            }
        },
        queryAll : function(callback){
            if(this.db.objectStoreNames.contains(this.tableName)){
                var me = this;
                //通过事物去操控表格
                var transaction = this.db.transaction(this.tableName,"readwrite");
                //事物的回调函数处理
                transaction.oncomplete = function(e){
                    console.log("transaction complete!");
                };
                transaction.onerror = function(e){
                    console.dir(e);
                };

                //得到表里面的objectStore对象
                var objectStore = transaction.objectStore(this.tableName);
                //使用游标遍历
                var datas = [];
                objectStore.openCursor().onsuccess =function(e){
                    var cursor = e.target.result;
                    if(!cursor){
                        console.log('No data!');
                        return callback(datas);
                    }
                    datas.push(cursor)
                    cursor.continue();
                };
                objectStore.openCursor().onerror=function(e){
                    console.dir(e);
                }
            }
        },
        //删除数据库
        drop : function(name){
            this.indexedDB.deleteDatabase(name);
            console.log('drop db[' + name + '] success!');
        }

    }
