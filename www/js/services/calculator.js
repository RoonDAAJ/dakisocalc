'use strict';

var vanwylick = angular.module('nl.vanwylick', []);

vanwylick.factory('calculator', function() {
	var materials = [
 		{
			type: 'eps60',
			name: 'EPS 60',
			lambda: 0.038,
			dimensions: [{l:1000,w:400}]
		}, 		
		{
			type: 'eps100',
			name: 'EPS 100',
			lambda: 0.036,
			dimensions: [{l:1000,w:400}]
		},
		{
			type: 'eps200',
			name: 'EPS 200',
			lambda: 0.033,
			dimensions: [{l:1000,w:400}]
		},
		{
			type: 'epsll',
			name: 'EPS LL',
			lambda: 0.031,
			dimensions: [{l:1000,w:400}]
		},
		{
			type: 'pir',
			name: 'PIR',
			lambda: 0.027,
			dimensions: [{l:1200,w:600}]
		}
	];
	
	var betopor = {
		lambda: 0.13,
		height: 60,
		width_seam: 20
	};
	
	var calculator = function() {
		this.settings = {
			corr_factor: 1.05,
			material : materials[0],
			dimension: materials[0].dimensions[0],
			betopor: betopor,
			A : {
				height: ''
			},
			AA : {
				height: ''
			},
			B : {
				height: ''
			},
			C : {
				height: ''
			}
		};
	};
	
	calculator.prototype = {
		get_material : function(type) {
			if (type) {
				for (var i=0; i < materials.length; i++) {
					if (type == materials[i].type) return angular.copy(materials[i]);
				}
				return null;
			}

			return angular.copy(materials);
		},
		
		ready_to_calculate : function() {
			return this.settings.material.lambda && this.settings.corr_factor &&
				this.settings.dimension.l && this.settings.dimension.w &&
				this.settings.betopor.lambda && this.settings.betopor.width_seam &&  this.settings.betopor.height &&
				this.settings.A.height && this.settings.AA.height && this.settings.B.height && this.settings.C.height;
		},
		
		calculate : function() {

			// uitgangspunten
			var r = angular.copy(this.settings);
			r.surface = {
				material: r.dimension.l * r.dimension.w / 1000000,
				betopor: ((r.betopor.width_seam * r.dimension.l) + (Math.pow(r.betopor.width_seam, 2) + (r.betopor.width_seam * r.dimension.w))) / 1000000
			};
			r.surface.total = r.surface.material + r.surface.betopor;

			// punt A, AA, B & C
			angular.forEach(['A', 'AA', 'B', 'C'], function(value) {
				var p = r[value];
				p.height_betopor = p.height_betopor || r.betopor.height;
				p.height_material = p.height - p.height_betopor;
				p.R_iso = p.height_material / 1000 / r.material.lambda;
				p.R_piro = p.height_material / 1000 / r.betopor.lambda;
				p.ll = (r.material.lambda * r.surface.material + r.betopor.lambda * r.surface.betopor) / r.surface.total;
				p.RR = p.height_material / 1000 / p.ll;
				p.R_material = p.RR;
				p.R_betopor = p.height_betopor / 1000 / r.betopor.lambda;
				p.R = p.R_material + p.R_betopor;
				p.lamba = p.height / 1000 / p.R;
				p.Um = 1 / (p.R + 0.14);
			});
			
			// Afshot
			r.triangles = [];
			r.triangles.push({Um: (r.A.Um*2 + r.B.Um + r.C.Um) / 4});
			r.triangles.push({Um: (r.AA.Um*2 + r.B.Um + r.C.Um) / 4});
			r.triangles[0].Rm = 1 / r.triangles[0].Um - 0.14;
			r.triangles[1].Rm = 1 / r.triangles[1].Um - 0.14;
			r.Rm = 1 / ((r.triangles[0].Um + r.triangles[1].Um) / 2);
			r.height_avg = (((r.B.height + r.AA.height*2) / 3) + ((r.A.height+r.B.height+r.C.height)) / 3) / 2; 
			r.lambda = r.height_avg / 1000 / r.Rm;

			//console.log(r);
			return r;
		}
	};
	
	return new calculator();
});
