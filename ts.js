//Teriable Texture Syth
tS = function(input, canvas, args){
	console.log(input);
	this.input = input;
	this.canvas = document.getElementById(canvas);
	this.out = document.getElementById('out');
	this.args = args;
	this.textons = [];
	this._i = 0;
	this._skip = 4;
	this._x = 5;
	this._y = 5;
	this.stepX = 0;
	this.stepY = 0;
	this._loadCanvas();
	this.tempCanvas = document.createElement('canvas');
	return this;
};





tS.prototype._loadCanvas = function(dataURL) {
        //Loading of the home test image - img1
        var img = new Image();
		var self = this;
        //drawing of the test image - img1
        img.onload = function () {
			self.sampleImage = this;
			var ctx = self.tempCanvas.getContext('2d');
			self.tempCanvas.width = img.width;
			self.tempCanvas.height = img.height;
            //draw background image
            ctx.drawImage(img, 0, 0);
			self.sampleData = ctx.getImageData(0, 0, img.width, img.height);
			self.sampleWidth = self.sampleData.width;
			self.sampleHeight = self.sampleData.height;
			self.sampleContext = ctx;
			self.createTextons();
        };

        img.src = 'test1.gif';
  
}
tS.prototype.createTextons = function(){
	this.outPutTexton();
	
};

tS.prototype.outPutTexton = function(){
	var self = this;
	if(((this.sampleWidth/this._skip)-10)*((this.sampleHeight/this._skip)-(10)) > this._i){
	var t = new tS.Texton(this);
	this.textons.push(t);
	document.getElementById('output').innerHTML ='<div>'+
	'<span>'+
	this._i+' : '+
	'</span>'+
	'<span>'+
	t.value+
	'</span>'+
	'</div>';
	this.showTexton(t);
	this.stepX+=5;
	this._x+=this._skip;
	if(this.stepX > this.canvas.width){
	this.stepX = 0;
	this.stepY +=5;
	}
	if(this._x > this.sampleWidth-10){
	this._x=0;
	this._y+=this._skip;
	}
	
	this._i++;
	setTimeout(function(){self.outPutTexton()},0);
	}else{
	this._i=0;
	this._x=0;
	this._y=0;
	this.stepY+=10;
	this.stepX = 0;
	this.outPutTextonAvg();
	return
	}
};



tS.prototype.showTexton = function(n){
	var ctx = this.canvas.getContext('2d');
	var i = 0;
		for(var y = 0; y<5 ; y++){
			for(var x = 0; x<5; x++){
				//console.log("rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)");
				var cX = x+this.stepX;
				var cY = y+this.stepY;
				ctx.fillStyle = "rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)";
				ctx.fillRect( cX, cY, 1, 1 );
				i+=4;
			}
		}
};

tS.prototype.outPutTextonAvg = function(n){
	//console.log("OUT{UT AVG");
	var self = this;
	if(this.textons.length > this._i){
	var t = this.textons[this._i];
	this.showTextonAvg(t);
	document.getElementById('output').innerHTML ='<div>'+
	'<span>'+
	this._i+' : '+
	'</span>'+
	'<span>'+
	t.value+
	'</span>'+
	'</div>';	
	this.stepX++;	
	if(this.stepX > this.canvas.width){
	this.stepX = 0;
	this.stepY +=1;
	}
		
	this._i++;
	setTimeout(function(){self.outPutTextonAvg()},0);
	}else{
		this.setUpRef();
	return	
	}
	
};

tS.prototype.showTextonAvg = function(n){
	var ctx = this.canvas.getContext('2d');
					
				ctx.fillStyle = n.value;
				ctx.fillRect( this.stepX, this.stepY, 1, 1 );
			
		
};

tS.prototype.setUpRef = function(){
	console.log('setting Up Refrence');
	var ctx = this.out.getContext('2d');
	var refW = this.sampleWidth;
	var refH = this.sampleHeight;
	ctx.fillStyle = 'rgba(100,100,100,1)';
	ctx.fillRect( refW-1, 0, 1, this.out.height );
	ctx.fillRect( 0, refH-1, this.out.width, 1 );
	ctx.drawImage(this.sampleImage, 0, 0);
	ctx.drawImage(this.sampleImage, refW, 0);
	ctx.drawImage(this.sampleImage, 0, refH);
	
	this.createFirstZone();
};

tS.prototype.createFirstZone = function(){
	this._i = 0;
	this._x = 0;
	this._y = 0;
	document.getElementById('output').innerHTML ='<div>'+
	'Building first Zone...'+
	'</div>';
	this.fZgo();
};

tS.prototype.fZgo = function(){
	var self = this;
	var refW = this.sampleWidth;
	var refH = this.sampleHeight;
	var ctx = this.out.getContext('2d');
	//console.log(this.getTexton2());
	
	if(this._y < this.sampleHeight){
		var newT = this.getTexton2();
		document.getElementById('output').innerHTML ='<div>'+
	'<span>'+
	this._i+' : '+
	'</span>'+
	'<span>'+
		newT.value+
	'</span>'+
	'</div>';
		
		ctx.fillStyle = newT.value;
		ctx.fillRect( refW+this._x, refH+this._y, 1, 1 );
		
		this._i++;
		this._x++;
		if(this._x > this.sampleWidth){
		this._x=0;
		this._y++;
		}
		setTimeout(function(){self.fZgo()},0);
	}else{
		this.startExpand();
	return	
	}
	
};

tS.prototype.startExpand = function(){
	console.log('starting Expansion');
	this.zX = this.sampleHeight*2;
	this.zY = this.sampleWidth;
	var totalZones = Math.floor((((this.out.width-this.sampleWidth)*(this.out.height-this.sampleHeight)) -
					  (this.sampleWidth*this.sampleHeight))/(this.sampleWidth*this.sampleHeight));
	console.log(totalZones+":Total Zones");
	this.tZ = totalZones;
	this.expandRef();
	this.expand();	  
		
};

tS.prototype.expandRef = function(){
	var self = this;
	var refW = this.sampleWidth;
	var refH = this.sampleHeight;
	var ctx = this.out.getContext('2d');
	var newRef = ctx.getImageData(refW, refH, refW, refH);
	for(var x = refW; x<this.out.width; x+=refW){
			ctx.putImageData(newRef, x, 0);
	}
	
	for(var y = refH; y<this.out.height; y+=refH){
			ctx.putImageData(newRef, 0, y);
	}
};
tS.prototype.expand = function(){
	
	for(var z=0; z<3; z++){
		if(z==0){
			this._i = 0;
			this._x = this.sampleWidth*2;
			this._y = this.sampleHeight;
		}else{
			this._i = 0;
			this._x = this.sampleWidth;
			this._y = this.sampleHeight;
		}
		
		while(this._y<this.sampleHeight){	
			var newT = this.getTexton2();
			
			document.getElementById('output').innerHTML ='<div>'+
	'<span>'+
	this._i+' : '+
	'</span>'+
	'<span>'+
		newT.value+
	'</span>'+
	'</div>';
		
		ctx.fillStyle = newT.value;
		ctx.fillRect( this._x, this._y, 1, 1 );
		
		this._i++;
		this._x++;
		if(this._x > this.sampleWidth){
		this._x=0;
		this._y++;
		}
	}
			
	};
	
};



tS.prototype.getTexton2 = function(){
	var t = new tS.Texton2(this);
	var closest = this.testTexton(t);
	return this.textons[closest];
};



tS.prototype.testTexton = function(t){
	var rA = [];
	var rID = [];
	for(var i =0; i<this.textons.length; i++){
		var dif = Math.abs(this.textons[i].total - t.total);
		rA.push(dif);
		rID.push(dif);
	}
	rA.sort(function(a, b){return a-b});
	for(var i =0; i<rID.length; i++){
		if(rID[i]==rA[0]){
		return i;	
		}
	}
	
};

tS.Texton = function(parent){
	this.parent = parent;
	this.include = [
	[-2,-2],[-1,-2],[0,-2],[1,-2],[1,-2],
	[-2,-1],[-1,-1],[0,-1],[1,-1],[1,-1],
	[-2, 0],[-1, 0],[0, 0],[1, 0],[1, 0],
	[-2, 1],[-1, 1],[0, 1],[1, 1],[1, 1],
	[-2, 2],[-1, 2],[0, 2],[1, 2],[1, 2]	
	];
	this.data = [];
	this.value = 0;
	this.init();
	return this;
};

tS.Texton.prototype.init = function(){
	var oX = this.parent._x*4;
	var oY = this.parent._y*(this.parent.sampleWidth*4);
	var data = this.parent.sampleData.data;	
	var oId = oX+oY;

	for(var i = 0; i<this.include.length; i++){
		var point = this.include[i];
		var xV = oX - (point[0]*4),
			yV = oY - (point[1]*(this.parent.sampleWidth*4));
			var id = xV+yV;
			this.data.push(data[id], data[id+1],data[id+2], data[id+3]);			
	}
	var r = 0, g = 0, b = 0, a = 0;
	var t = 0;
	for(var i = 0; i<this.data.length; i+=4){
		r+=this.data[i];
		g+=this.data[i+1];
		b+=this.data[i+2];
		a+=this.data[i+3];
		t+=this.data[i]+this.data[i+1]+this.data[i+2];
	}
	r=Math.floor((r+data[oId]*0.5)/(this.data.length/4));
	g=Math.floor((g+data[oId+1]*0.5)/(this.data.length/4));
	b=Math.floor((b+data[oId+2]*0.5)/(this.data.length/4));
	a=Math.floor((a+data[oId+3]*0.5)/(this.data.length/4));
	t=t/(this.data.length/4);
	this.total = t;
	this.oColor = 'rgba('+data[oId]+','+data[oId+1]+','+data[oId+2]+',1)';
	this.value = 'rgba('+r+','+g+','+b+',1)';
};

tS.Texton2 = function(parent){
	this.parent = parent;
	this.include = [
	
	[-5,-4],[-4,-4],[-3,-4],[-2,-4],[-1,-4],[0,-4],
	[-5,-3],[-4,-3],[-3,-3],[-2,-3],[-1,-3],[0,-3],
	[-5,-2],[-4,-2],[-3,-2],[-2,-2],[-1,-2],[0,-2],
	[-5,-1],[-4,-1],[-3,-1],[-2,-1],[-1,-1],[0,-1],
	[-5, 0],[-4, 0],[-3, 0],[-2, 0],[-1, 0]	
	];
	this.data = [];
	this.value = 0;
	this.init();
	return this;
};

tS.Texton2.prototype.init = function(){
	var oX = this.parent._x*4;
	var oY = this.parent._y*(this.parent.out.width*4);
	
	
	var data = this.parent.out.getContext('2d');
	data = (data.getImageData(0, 0, this.parent.out.width, this.parent.out.height)).data;

	for(var i = 0; i<this.include.length; i++){
		var point = this.include[i];
		var xV = oX - (point[0]*4),
			yV = oY - (point[1]*(this.parent.sampleWidth*4));
			var id = xV+yV;
			this.data.push(data[id], data[id+1],data[id+2], data[id+3]);			
	}
	var r = 0, g = 0, b = 0, a = 0;
	var t = 0;
	for(var i = 0; i<this.data.length; i+=4){
		r+=this.data[i];
		g+=this.data[i+1];
		b+=this.data[i+2];
		a+=this.data[i+3];
		t+=this.data[i]+this.data[i+1]+this.data[i+2];
	}
	r=Math.floor(r/(this.data.length/4));
	g=Math.floor(g/(this.data.length/4));
	b=Math.floor(b/(this.data.length/4));
	a=Math.floor(a/(this.data.length/4));
	t=t/(this.data.length/4);
	this.total = t;
	this.value = 'rgba('+r+','+g+','+b+',1)';
};







