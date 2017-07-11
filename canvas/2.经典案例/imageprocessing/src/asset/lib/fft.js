define([],function(){var r=function(a,i){0==arguments.length?(this.real=0,this.imaginary=0):1==arguments.length?(this.real=arguments[0].real,this.imaginary=arguments[0].imaginary):(this.real=a,this.imaginary=i),this.setReal=function(r){this.real=r},this.setImaginary=function(r){this.imaginary=r},this.getReal=function(){return this.real},this.plus=function(a){var i=new r;return i.setReal(this.real+a.real),i.setImaginary(this.imaginary+a.imaginary),i},this.minus=function(a){var i=new r;return i.setReal(this.real-a.real),i.setImaginary(this.imaginary-a.imaginary),i},this.mul=function(a){var i=new r;return i.setReal(this.real*a.real-this.imaginary*a.imaginary),i.setImaginary(this.real*a.imaginary+this.imaginary*a.real),i},this.div=function(a){var i=new r;return i.setReal(this.real/a),i.setImaginary(this.imaginary/a),i},this.norm=function(){return Math.sqrt(this.real*this.real+this.imaginary*this.imaginary)},this.angle=function(){return Math.atan2(this.imaginary,this.real)},this.conjugate=function(){return new r(this.real,this.imaginary*-1)},this.toString=function(){return 0==this.real?0==this.imaginary?"0":this.imaginary+"i":0==this.imaginary?this.real+"":this.imaginary<0?this.real+""+this.imaginary+"j":this.real+"+"+this.imaginary+"j"}},a=function(r){for(var a=[],i=0;i<r.row;i++)for(var t=0;t<r.col;t++)a[i*r.row+t]=r.at(i,t)*Math.pow(-1,i+t);return a},i=function(r,a){for(var i=-9999999999,t=9999999999,n=0;n<a.length;n++)a[n].norm()>i&&(i=a[n].norm()),a[n].norm()<t&&(t=a[n].norm());for(var e=r.data,n=0;n<r.data.length;n+=4)e[n]=e[n+1]=e[n+2]=255*((a[n/4].norm()-t)/(i-t)),e[n+3]=255},t=function(a){var i=a.length;if(1==i)return[a[0]];for(var n=[],e=0;e<i/2;e++)n[e]=a[2*e];for(var s=t(n),h=[],e=0;e<i/2;e++)h[e]=a[2*e+1];for(var o=t(h),f=[],l=new r,g=0;g<i/2;g++){l.real=Math.cos(2*Math.PI*g/i),l.imaginary=Math.sin(-2*Math.PI*g/i);var u=o[g].mul(l);f[g]=s[g].plus(u),f[g+i/2]=s[g].minus(u)}return f},n=function(a,i,t,n,e){var h=[];if(1==n){for(var o=0;o<t;o++)h[o]=new r(a[e+o],0);h=s(h);for(var o=0;o<h.length;o++)i[e+o]=h[o]}else{for(var o=0;o<t;o++)h[o]=new r(a[e+o*n]);h=s(h);for(var o=0;o<h.length;o++)i[e+o*n]=h[o]}},e=function(r,a,i){for(var t=[],e=0;e<i;e++)n(r,t,a,1,e*a);for(var e=0;e<a;e++)n(t,t,i,a,e);return t},s=function(r){for(var a=r.length,i=[],n=0;n<a;n++)i[n]=r[n].conjugate();i=t(i);for(var n=0;n<a;n++)i[n]=i[n].conjugate(),i[n]=i[n].div(a);return i},h=function(a,i,t,n,e){var h=[];if(1==n){for(var o=0;o<t;o++)h[o]=new r(a[e+o]);h=s(h);for(var o=0;o<h.length;o++)i[e+o]=h[o]}else{for(var o=0;o<t;o++)h[o]=new r(a[e+o*n]);h=s(h);for(var o=0;o<h.length;o++)i[e+o*n]=h[o]}},o=function(r,a,i){for(var t=[],n=0;n<i;n++)h(r,t,a,1,n*a);for(var n=0;n<a;n++)h(t,t,i,a,n);return t};return{center:a,scale:i,fft2D:e,ifft2D:o}});