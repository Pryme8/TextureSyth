
dN = dN;

tS = function(){
	this.inputCvas = document.getElementById('in');
	this.mapCvas = document.getElementById('map');
	this.textonCvas = document.getElementById('textons');
	this.maptCvas = document.getElementById('map-textons');
	this.outmapCvas = document.getElementById('out-map');
	this.outCvas = document.getElementById('out');
	
	this.textons = [];
	this.refTextons = [];
	
	var img = new Image();
	var self = this;
        //drawing of the test image - img1
        img.onload = function () {
			self.sampleImage = this;
			self.inputCvas.width = img.width;
			self.inputCvas.height = img.height;
			var ctx = self.inputCvas.getContext('2d');
            //draw background image
            ctx.drawImage(img, 0, 0);
			self.sampleData = ctx.getImageData(0, 0, img.width, img.height);
			self.sampleWidth = self.sampleData.width;
			self.sampleHeight = self.sampleData.height;
			self.sampleContext = ctx;
			output('Generated Sample Context \n sampleWidth:'+self.sampleWidth+' sampleHeight:'+self.sampleHeight);
			self._generateRefMap();
        };

        img.src = './test1.gif';
	
};

tS.prototype._generateRefMap = function(){
			this.mapCvas.width = this.sampleWidth;
			this.mapCvas.height = this.sampleHeight;
			var imgData = new ImageData(this.sampleWidth, this.sampleHeight);
			var data = imgData.data;
			this.refMap = new dN('Simple2','newseed',{octave:6, width:50, height:50, scale:40, amplitude:0.5, persistence:0.65, frequency:0.5, style:'manhattan', n:12, nPoints:3});
						
			var x=1,y=1;
			for(var i=0; i < data.length; i+=4){
				var v = this.refMap.getValue({x:x,y:y});
			
				var r = Math.floor(255 * v),
   					g = Math.floor(255 * v),
    				b = Math.floor(255 * v),
    				a = 255;    
    
      			data[i]     = r; // red
      			data[i + 1] = g; // green
     			data[i + 2] = b; // blue
      			data[i + 3] = a;//alpha
     
     		 
      	if(x<this.sampleWidth){
			x++;
			continue;
		}else{
        	y++;
       		x=1;
        	continue;
		}
      	
				
		}
			var ctx = this.mapCvas.getContext('2d');
			ctx.putImageData(imgData, 0, 0, 0, 0, this.sampleWidth, this.sampleHeight);
			output('Map Generated');
			this.generateTextons();
			this.generateRefTextons();
			
			var self = this;
			setTimeout(function(){self.generateMainMap();},0);
		
};

tS.prototype.generateTextons = function(){
			var nSize = 5, skip=1;
			var vsd = (this.sampleWidth-(nSize*2))*
					  (this.sampleHeight-(nSize*2));//valid sample dimensions
			vsd = Math.floor(vsd/skip);
			
			
			var textonMapSizeX = 200;
			var textonMapSizeY = 300;
			this.textonCvas.width = textonMapSizeX;
			this.textonCvas.height = textonMapSizeY;
			output(vsd+": Total Predicted Textons @ a '"+skip+"' skip interval on the sample");
			this.tC = Math.floor(vsd/skip);	
			this.nSize = nSize;
			this.skip = skip;
	
			this.outputTexton(nSize,nSize,0,0,0);
	
};

tS.prototype.outputTexton = function(x,y,outX,outY,i){
	if(i<this.tC+this.nSize){
		var t = new tS.Texton(this,x,y,'sample');
		this.showTexton(outX,outY,t);
		this.textons.push(t);
		output(i+"/"+this.tC+" : Done");
		
		
		
		i++;
		
		if(x<this.sampleWidth-this.nSize){
			x+=this.skip;;
		}else{
			y++;
			x=this.nSize;	
		}
		if(outX < this.textonCvas.width){
			outX+=this.nSize;
		}else{
			outY += this.nSize;
			outX = 0;
		}
		var self = this;
		setTimeout(function(){self.outputTexton(x,y,outX,outY,i)},0);
	}
	
	
};

tS.prototype.showTexton = function(outX,outY,n){
	var ctx = this.textonCvas.getContext('2d');
	var i = 0;
		for(var y = 0; y<this.nSize ; y++){
			for(var x = 0; x<this.nSize; x++){
				//console.log("rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)");
				var cX = x+outX;
				var cY = y+outY;
				ctx.fillStyle = "rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)";
				ctx.fillRect( cX, cY, 1, 1 );
				i+=4;
			}
		}	
}


tS.prototype.generateRefTextons = function(){
			
					console.log('start Ref Texton Gen');
			
			var textonMapSizeX = 200;
			var textonMapSizeY = 300;
			this.maptCvas.width = textonMapSizeX;
			this.maptCvas.height = textonMapSizeY;
		
			this.outputTextonRef(this.nSize,this.nSize,0,0,0);	
};

tS.prototype.outputTextonRef = function(x,y,outX,outY,i){
	if(i<this.tC){
		var t = new tS.Texton(this,x,y,'ref');
		this.showTextonRef(outX,outY,t);
		this.refTextons.push(t);
		output(i+"/"+this.tC+" : Done");
		
		
		
		i++;
		
		if(x<this.sampleWidth-this.nSize){
			x+=this.skip;
		}else{
			y++;
			x=this.nSize;	
		}
		if(outX < this.textonCvas.width){
			outX+=this.nSize;
		}else{
			outY += this.nSize;
			outX = 0;
		}
		var self = this;
		setTimeout(function(){self.outputTextonRef(x,y,outX,outY,i)},0);
	}else{
	
	this.generateNewTexture(0,0,this.nSize);
		
	}
	
	
};

tS.prototype.showTextonRef = function(outX,outY,n){
	var ctx = this.maptCvas.getContext('2d');
	var i = 0;
		for(var y = 0; y<this.nSize; y++){
			for(var x = 0; x<this.nSize; x++){
				//console.log("rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)");
				var cX = x+outX;
				var cY = y+outY;
				ctx.fillStyle = "rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)";
				ctx.fillRect( cX, cY, 1, 1 );
				i+=4;
			}
		}	
}

tS.prototype.generateMainMap = function(){
			var imgData = new ImageData(600, 600);
			var data = imgData.data;
									
			var x=1,y=1;
			for(var i=0; i < data.length; i+=4){
				var v = this.refMap.getValue({x:x,y:y});
			
				var r = Math.floor(255 * v),
   					g = Math.floor(255 * v),
    				b = Math.floor(255 * v),
    				a = 255;    
    
      			data[i]     = r; // red
      			data[i + 1] = g; // green
     			data[i + 2] = b; // blue
      			data[i + 3] = a;//alpha
     
     		 
      	if(x<600){
			x++;
			continue;
		}else{
        	y++;
       		x=1;
        	continue;
		}
      	
				
		}
			var ctx = this.outmapCvas.getContext('2d');
			ctx.putImageData(imgData, 0, 0, 0, 0, 600, 600);
			output('Map Generated');
	
};

tS.prototype.generateNewTexture = function(x,y,step){
	if(y<this.outCvas.height-step){
		var rt = new tS.Texton(this,x,y,'ref2');
		var t = this.findClostestTexton(rt);
		this.drawNewTexton(x,y,t);
		
		if(x<this.outCvas.width-step){
			x+=step;
		}else{
			x=0;
			y+=step;	
		}
	var self = this;
	setTimeout(function(){self.generateNewTexture(x,y,self.nSize)},0);
	}
		
	
};

tS.prototype.drawNewTexton = function(xin,yin,n){
	var ctx = this.outCvas.getContext('2d');
	var i = 0;
			/*	ctx.fillStyle = n.value;
				ctx.fillRect( xin, yin, 1, 1 );*/
		for(var y = 0; y<this.nSize; y++){
			for(var x = 0; x<this.nSize; x++){
				//console.log("rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)");
				var cX = x+xin;
				var cY = y+yin;
				ctx.fillStyle = "rgba("+n.data[i]+","+n.data[i+1]+","+n.data[i+2]+",1)";
				ctx.fillRect( cX, cY, 1, 1 );
				i+=4;
			}
		}	
	
};



tS.prototype.findClostestTexton = function(rt){
	var value = rt.total;
			var rA = [];
			var rID = [];
	for(var i =0; i<this.refTextons.length; i++){
		var dif = Math.abs(this.refTextons[i].total - value);
		rA.push(dif);
		rID.push(dif);
	}
	rA.sort(function(a, b){return a-b});
	for(var i =0; i<rID.length; i++){
		if(rID[i]==rA[0]){
		return this.textons[i];	
		}
	}
};


function output(s){
	document.getElementById('output').innerHTML = s;
}


tS.Texton = function(parent, x, y, t){
	
	this.type = t;
	//console.log(this.type);
	
	this.parent = parent;
	if(this.type!='ref2'){
	this.include = [	
	[-2,-2],[-1,-2],[ 0,-2],[ 1,-2],[ 2,-2],
	[-2,-1],[-1,-1],[ 0,-1],[ 1,-1],[ 2,-1],
	[-2, 0],[-1, 0],[ 0, 0],[ 1, 0],[ 2, 0],
	[-2, 1],[-1, 1],[ 0, 1],[ 1, 1],[ 2, 1],
	[-2, 2],[-1, 2],[ 0, 2],[ 1, 2],[ 2, 2]
	];
	}else{
	this.include = [
	[0,0],[1,0],[2,0],[3,0],[4,0],
	[0,1],[1,1],[2,1],[3,1],[4,1],
	[0,2],[1,2],[2,2],[3,2],[4,2],
	[0,3],[1,3],[2,3],[3,3],[4,3],
	[0,4],[1,4],[2,4],[3,4],[4,4],
	];	
	}
	this.data = [];
	this.value = 0;
	this.x = x;
	this.y = y;
	this.init();
	return this;
};

tS.Texton.prototype.init = function(){
	var oX = this.x*4;
	var oY;
	if(this.type!='ref2'){
	oY = this.y*(this.parent.sampleWidth*4);
	}else{
	oY = this.y*(this.parent.outmapCvas.width*4);
	}
	var oId = oX+oY;
	
	var data;
	if(this.type=='sample'){
		data = this.parent.sampleData.data;	}
	else if(this.type == 'ref'){
		var tctx = this.parent.mapCvas.getContext('2d');
		data = (tctx.getImageData(0, 0, this.parent.sampleWidth, this.parent.sampleHeight)).data;
	}else{
		var tctx = this.parent.outmapCvas.getContext('2d');
		data = (tctx.getImageData(0, 0, this.parent.outmapCvas.width, this.parent.outmapCvas.height)).data;
	}
	
	if(this.type!='ref2'){

	for(var i = 0; i<this.include.length; i++){
		var point = this.include[i];
		var xV = oX + (point[0]*4),
			yV = oY + (point[1]*(this.parent.sampleWidth*4));
			var id = xV+yV;
			//console.log(id);
			//console.log(data[id]);
			this.data.push(data[id], data[id+1],data[id+2], data[id+3]);			
	}
	
	}else{
		for(var i = 0; i<this.include.length; i++){
		var point = this.include[i];
		var xV = oX + (point[0]*4),
			yV = oY + (point[1]*(this.parent.outmapCvas.width*4));
			var id = xV+yV;
			//console.log(id);
			//console.log(data[id]);
			this.data.push(data[id], data[id+1],data[id+2], data[id+3]);			
	}
		
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
	t=t/(this.data.length/3);
	this.total = t;
	this.oColor = 'rgba('+data[oId]+','+data[oId+1]+','+data[oId+2]+',1)';
	this.value = 'rgba('+r+','+g+','+b+',1)';
};
