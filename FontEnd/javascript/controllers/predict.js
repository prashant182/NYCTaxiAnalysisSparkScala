angular.module('NYCTaxiAPP')
.controller('predictCtrl', function($scope,$http) {
	$scope.months=[ "January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",];
	
    $scope.selectedMonth;
    $scope.getSelectedMonth = function() {
      if ($scope.selectedMonth !== undefined) {
        return "Month : " + $scope.selectedMonth;
      } else {
        return "Please select a month";
      }
    };
    $scope.items = [
    "00:00 - 01:00", 
    "01:00 - 02:00", 
    "02:00 - 03:00", 
    "03:00 - 04:00", 
    "04:00 - 05:00", 
    "05:00 - 06:00", 
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00", 
    "10:00 - 11:00", 
    "11:00 - 12:00", 
    "12:00 - 13:00", 
    "13:00 - 14:00", 
    "14:00 - 15:00", 
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00", 
    "19:00 - 20:00", 
    "20:00 - 21:00", 
    "21:00 - 22:00", 
    "22:00 - 23:00", 
    "23:00 - 24:00", 
    ];
    $scope.selectedItem;
    $scope.getSelectedText = function() {
      if ($scope.selectedItem !== undefined) {
        return "Time : " + $scope.selectedItem;
      } else {
        return "Please select a time";
      }
    };
    $scope.latlng = [40.791, -73.947];
    $scope.getpos = function(event){
        $scope.latlng = [event.latLng.lat(), event.latLng.lng()];
        var location = $scope.latlng;
        console.log(location);
        $scope.latitude = location[0];
        $scope.longitude = location[1];
    };
    $scope.submit = function() {
        var longitude = $scope.longitude;
        var latitude = $scope.latitude;
        var timeZone =  $scope.items.indexOf($scope.selectedItem);
		var month=$scope.months.indexOf($scope.selectedMonth);
		var jsonPath;
		switch(month){
			case 0:
			jsonPath='/GMM_jan.json';
			break;
			case 1:
			jsonPath='/GMM_jun.json';
			break;
			case 2:
			jsonPath='/GMM_may.json';
			break;
			case 3:
			jsonPath='/GMM_apr.json';
			break;
			case 4:
			jsonPath='/GMM_may.json';
			break;
			case 5:
			jsonPath='/GMM_jun.json';
			break;
			default:
			jsonPath='/GMM_jan.json';			
		}
		
        $http.get(jsonPath).success(function(data) {
            var GMM = data[timeZone];
            console.log(GMM);
            var coordinates = [];
            var dis = []
            for (i = 0; i < GMM.length; i++){
                coordinates.push(GMM[i]['coordinates']);
            }
            console.log(coordinates);
            for (i = 0; i < coordinates.length; i++){ 
                var distance = Math.sqrt((longitude - coordinates[i][0]) * (longitude - coordinates[i][0])  + (latitude - coordinates[i][1]) * (latitude - coordinates[i][1]));
                dis.push(distance);
            }
            var minIndex = indexOfMin(dis);
            var total;
			var total_jan = [387467, 293547, 223915, 164874, 121993, 108371, 230488, 395844, 481684, 482278, 471223, 492615, 524667, 520991, 551189, 552029, 500109, 579756, 678363, 669539, 612013, 596053, 569648, 471493 ];
		
			var total_feb = [386304, 275477, 207443, 148510, 112271, 109004, 246544, 419186, 519418, 520264, 499799, 519206, 554035, 555653, 576898, 564757, 510384, 600506, 711151, 702222, 647884, 634192, 609035, 514083];
            
			var total_mar = [420944, 301488, 203178, 164624, 125530, 122203, 270865, 460453, 562488, 560929, 538237, 551110, 577771, 579024, 605066, 587703, 534209, 636852, 753678, 757590, 715488, 703485, 662423, 569553];

            var total_apr = [428228, 313197, 231181, 167910, 124509, 118147, 260696, 446752, 538270, 543133, 523806, 544815, 571470, 566127, 591338, 571846, 508811, 606519, 719027, 724282, 693038, 671522, 657718, 571178];

            var total_may = [430048, 310212, 230365, 166757, 127844, 124445, 267855, 450202, 531873, 535408, 530079, 551132, 576519, 577899, 608412, 571448, 506239, 602285, 705330, 706703, 668591, 663004, 633483, 547301];

            var total_jun =[ 424288, 295895, 211306, 152547, 120092, 118431, 259655, 422258, 512473, 514376, 495868, 520207, 539753, 538521, 550349, 513661, 456554, 543117, 651806, 663949, 602857, 646977, 624217, 553618];

            switch(month){
				case 0:
				total=total_jan;
				break;
				case 1:
				total=total_feb;
				break;
				case 2:
				total=total_mar;
				break;
				case 3:
				total=total_apr;
				break;
				case 4:
				total=total_may;
				break;
				case 5:
				total=total_jun;
				break;
				default:
				total=total_jan;
		}
		   
            console.log(minIndex);
            var gaussian = GMM[minIndex]
            var temp =  total[timeZone] * integral(longitude - 0.005, latitude - 0.005, longitude + 0.005, latitude + 0.005, 20, gaussian) * gaussian.mag;
            console.log(total[timeZone]);
            console.log(temp);
            console.log('mag');
            console.log(gaussian.mag);
            $scope.pickups = temp;
        });
    };

    function func(x, y, gaussian){
        var mu1 = gaussian.coordinates[0];
        var mu2 = gaussian.coordinates[1];
        var matrix = gaussian.sigma;
        var sigma1 = Math.sqrt(matrix[0][0]);
        var sigma2 = Math.sqrt(matrix[1][1]);
        var p = matrix[0][1] / sigma1 / sigma2;
        //console.log(mu1,mu2,sigma1,sigma2,p);
        var A = 1/(2*Math.PI*sigma1*sigma2*Math.sqrt(1 - p * p));
        var B = Math.exp(-1/(2*(1 - p*p))*(Math.pow((x - mu1),2)/Math.pow(sigma1,2) + Math.pow(y - mu2, 2)/Math.pow(sigma2, 2) - 2*p*(x - mu1)*(y - mu2)/sigma1/sigma2));
        //console.log(A);
        //console.log(B);
        //console.log(A*B);
        return A*B;
    };

    function integral(x1,y1,x2,y2,n,gaussian){
        var dx = (x2 - x1)/n;
        var dy = (y2 - y1)/n;
        var sum = 0;

        console.log('debug1');
        console.log(dx);
        console.log(dy);
        for (var i = 0; i < n; i++){
            var x = x1 + i * dx;
            //console.log('x');
            //console.log(x);
            for (var j = 0; j < n; j++){
                var y = y1 + i * dy;
                var funVal = func(x, y, gaussian);
                //console.log(dx*dy*funVal);
                sum += dx * dy * funVal;
            }
        }
        console.log(sum);
        return sum;
    };

    function indexOfMin(arr) {
        if (arr.length === 0) {
            return -1;
        }
        var min = arr[0];
        var minIndex = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                minIndex = i;
                min = arr[i];
            }
        }
        return minIndex;
    };

});
