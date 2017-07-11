//websql操作类工具 V1.0，by xfz
(function(){
	var WebSql = function(options){
		if(this instanceof WebSql){
			this.dbname = options.dbname;
			this.version = options.version||'1.0';
			this.desc = options.desc||'我的数据库';
			this.size = options.size||64*1024;
			this._db = null;
		}else{
			return new WebSql(options);
		}
	};
	WebSql.prototype = {
		openDB: function(callback){
			this._db = window.openDatabase(this.dbname, this.version, this.desc, this.size); 
			callback && callback();
			return this;
		},
		dropTable: function(tablename){
			if(!this._db) return false;
			this._db.transaction(function(tx){
				tx.executeSql('DROP TABLE ' + tablename);
			});
		},
		exeSql: function(sql, where, callback){
			if(!this._db) return false;
			this._db.transaction(function(tx){
				tx.executeSql(sql, where, function(tx, result){
					callback && callback(true);
				},function(tx, error){
					callback && callback(false);
					console.error('[FAIL]：' + error.message);
				});
			});
		},
		query: function(sql, where, callback){
			if(!this._db) return [];
			this._db.transaction(function(tx){
				tx.executeSql(sql, where, function(tx, result){
					var arr = [];
					if(result.rows && result.rows.length){
						for(var i=0,rows=result.rows,len=rows.length;i<len;i++){
							arr.push(rows.item(i));
						}
					}
					callback && callback(arr);
				},function(tx, error){
					callback && callback([]);
					console.error('[FAIL]：' + error.message);
				});
			});
		},
		getUUID: function(){
			var arr = [];
			arr.push((new Date).Format('yyyyMMddhhmmss'));
			arr.push(arguments[0]);
			arr.push(arguments[1]?arguments[1]:Math.floor(Math.random()*9 + 1));
			arr.push(arguments[2]?arguments[2]:'');
			return arr.join('');
		},
	};
	window['WebSql'] = WebSql;
})();

