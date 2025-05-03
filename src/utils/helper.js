
import moment from "moment";

class Helper {
    constructor() {

    }
    getDisplayDate(dt) {
        return moment(dt).format("DD/MM/YYYY");
      }

    removeObjFromArray(array, obj) {
        let loc = this.getArrayIndexByValue(array, obj);
        array.splice(loc, 1);
    }

    getArrayIndexByValue(arr, value) {
        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            if (arr[i].id == value) return i;
        }
    }

    getErrorMessage2(data){
        try {
            return data.data;
        } catch (error) {
            return "Unkown Error" + error;
        }
    }
    getErrorMessage(data) {
        var errorMessage = "";
        // console.log(data); //'23505: duplicate key
        if (data.responseException.exceptionMessage.title) {
            errorMessage = data.responseException.exceptionMessage.title;
            if (errorMessage == "One or more validation errors occurred.") {
                const myJSON = JSON.stringify(data.responseException.exceptionMessage.errors);
                errorMessage += "\n\n";
                errorMessage += myJSON;
            }
        } else {
            errorMessage = data.responseException.exceptionMessage;
        }
        return errorMessage;
    }

    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    }

    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    isIntOrFloat(n) {
        if (this.isInt(n) || this.isFloat(n))
            return true;
        else
            return false;
    }

    hexToRgbA(hex, opacity) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return 'rgb(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + Math.round((opacity / 100) * 10) / 10 + ')';
        }
        throw new Error('Bad Hex');
    }

    getErrorMessage(data) {
        var errorMessage = "";
        if (data.responseException.exceptionMessage.title) {
            errorMessage = data.responseException.exceptionMessage.title;
            if (errorMessage == "One or more validation errors occurred.") {
                const myJSON = JSON.stringify(data.responseException.exceptionMessage.errors);
                errorMessage += "\n\n";
                errorMessage += myJSON;
            }
        } else {
            errorMessage = data.responseException.exceptionMessage;
        }
        return errorMessage;
    }

    // getCenterOfShape(pointList) {

    //     //     var x = 0,
    //     //     y = 0,
    //     //     i,
    //     //     j,
    //     //     f,
    //     //     point1,
    //     //     point2;

    //     // for (i = 0, j = this.length - 1; i < this.length; j=i,i++) {
    //     //     point1 = this.points[i];
    //     //     point2 = this.points[j];
    //     //     f = point1.x * point2.y - point2.x * point1.y;
    //     //     x += (point1.x + point2.x) * f;
    //     //     y += (point1.y + point2.y) * f;
    //     // }

    //     // f = this.area() * 6;

    //     // return new Point(x / f, y / f);

    //     var minX, maxX, minY, maxY;
    //     // for (var i = 0; i < arr.length; i++)
    //     // {
    //     //     minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
    //     //     maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
    //     //     minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
    //     //     maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
    //     // }


    //     for (let i = 0; i < pointList.length; i = i + 2) {
    //         var currentPointX = pointList[i];
    //         var currentPointY = pointList[i + 1];
    //         minX = (currentPointX < minX || minX == null) ? currentPointX : minX;
    //         maxX = (currentPointX > maxX || maxX == null) ? currentPointX : maxX;
    //         minY = (currentPointY < minY || minY == null) ? currentPointY : minY;
    //         maxY = (currentPointY > maxY || maxY == null) ? currentPointY : maxY;

    //     }
    //     return [(minX + maxX) / 2, (minY + maxY) / 2];


    //     return [points[0], points[1]]
    // };

    // getDistanceInPixel(xA, yA, xB, yB) {
    //     try {
    //         var xDiff = xA - xB;
    //         var yDiff = yA - yB;
    //         return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    //     } catch (error) { }
    //     return 0;
    // };

    // convertDistancePixelToMeter(distanceInPixel, scaleMeterForOnePixel) {
    //     var distainceInMeter = distanceInPixel * scaleMeterForOnePixel;
    //     distainceInMeter = Math.round(distainceInMeter * 1000) / 1000;
    //     return distainceInMeter;
    // }

    // getCenterPosition(point1, point2) {
    //     return [
    //         (point1[0] + point2[0]) / 2,
    //         (point1[1] + point2[1]) / 2
    //     ]

    //     return {
    //         x: (obj.points[0] + obj.points[2]) / 2,
    //         y: (obj.points[1] + obj.points[3]) / 2,
    //     };


    // }

}

export default Helper;