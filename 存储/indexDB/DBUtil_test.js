//indexDB数据库封装插件
(function(){
	var DBUtil = function(){
		this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB ||window.msIndexedDB;
    	this.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    	this.con = null;
    	this.db = null;
    	this.name;
    	this.version;
    	this.tableName;
    	this.cells;
    	this.lastCursor;
	}
	DBUtil.prototype = {
		check: function(){
			return this.indexedDB ? true : false;
		},
		connect: function(options, callback){
			var me = this;
			me.name = options.baseName;
        	me.tableName = options.tableName;
        	me.version = options.version || 1;
        	me.cells = options.cells;
        	if(me.tableName == '' || me.tableName == undefined){
        		console.log('No tableName!');
            	return undefined;
        	}
        	if(me.cells == '' || me.cells == undefined){
            	console.log('No cells!');
            	return undefined;
        	}
        	//如果数据库存在就打开，如果数据库不存在就去新建
        	me.con = me.indexedDB.open(me.name,me.version);
        	me.con.onsuccess = function(e){
        		me.db = e.target.result;
        		console.log('Connect db[' + me.name + '] success! version[' + me.version + ']');
        		callback && callback();
        	}
        	me.con.onerror = function(e){
            	console.log('Connect db[' + me.name + '] failed!' + e.taeget.errorCode);
        	};
        	//创建新数据库，或者数据库版本号被更改的时候触发onupgradeneeded事件，并执行回调函数
			me.con.onupgradeneeded = function(e){
            	var thisdb = e.target.result;
            	//判断是否有这个表的存在
            	if(!thisdb.objectStoreNames.contains(me.tableName)){
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
		add: function(obj, callback){
			var transaction = this.db.transaction(this.tableName,'readwrite'),res;
			//事物回调函数的处理
			transaction.oncomplete = function(e){
				res = true;
				callback && callback(res);
			}
			transaction.onerror = function(e){
				res = false;
            	callback && callback(res);
        	}
        	//通过事物得到一个objectStore对象
        	var objectStore = transaction.objectStore(this.tableName);
        	objectStore.add(obj);
		},
		/**
         * 查询
         * @param cell       [哪一字段]
         * @param val        [条件值]
         * @param callback   [回调函数]
         */
		query: function(cell, val, callback){
			var transaction = this.db.transaction(this.tableName,'readonly'),
			    objectStore = transaction.objectStore(this.tableName),
			    boundKeyRange = this.IDBKeyRange.only(val), //生成一个辨识范围的Range对象
			    me = this,
			    res = [];
            //游标与索引相结合的查询，性能优化
            objectStore.index(cell).openCursor(boundKeyRange).onsuccess = function(e){
                var cursor = e.target.result; 
                if(!cursor){
                	callback && callback(res);
                    return;
                }
                res.push(cursor.value);
                //使游标下移，如果到最后娶不到值，返回undefined
                cursor.continue();
            }
		},
		queryAll: function(callback){
			if(this.db.objectStoreNames.contains(this.tableName)){
                var transaction = this.db.transaction(this.tableName,'readonly'),
                	objectStore = transaction.objectStore(this.tableName),
                	me = this,
                	res = [];
                objectStore.openCursor().onsuccess = function(e){
                    var cursor = e.target.result;
                    if(!cursor){
                    	callback && callback(res);
                        return;
                    }
                    res.push(cursor.value);
                    cursor.continue();
                };
                objectStore.openCursor().onerror = function(e){
                    console.log('query Error：' + e);
                }
            }
		},
		update: function(queryCell, queryVal, cell, val){
			var transaction = this.db.transaction(this.tableName,'readwrite'),
            	store = transaction.objectStore(this.tableName);
            store.index(queryCell).getAll(queryVal).onsuccess = function(e){
            	var arr = e.target.result;
            	console.log(arr);
            	for(var i=0,len=arr.length;i<len;i++){
            		var obj = arr[i];
            		obj[cell] = val;
            		store.put(obj);
            	}            	
            };
		},
		deleteRow: function(key, callback){
			var transaction = this.db.transaction(this.tableName,'readwrite'),
            	objectStore = transaction.objectStore(this.tableName),
            	request = objectStore.delete(parseInt(key));
            request.onsuccess = function(e){
            	callback && callback(true);
            };
            request.onerror = function(e){
                callback && callback(false);
            }
		},
		drop: function(name){
			this.indexedDB.deleteDatabase(name);
			console.log('Drop db[' + name + '] success!');
		}
	}
	window['DBUtil'] = DBUtil;
})();