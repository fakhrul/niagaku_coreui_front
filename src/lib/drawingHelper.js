
class DrawingHelper {
    constructor() {

    }
    
    getMiddlePoint(pointList) {
        var midIndex = Math.round((pointList.length) / 2)

        try {
            var point1 = pointList[midIndex - 1];
            var point2 = pointList[midIndex];
            return {
                x: point1,
                y: point2
            }

            // middlePoint.push(point1, point2) ;
            return
        } catch (error) {

        }
        return {
            x: pointList[0],
            y: pointList[1]
        };
    };
    getCenterOfShape(pointList) {
        var minX, maxX, minY, maxY;
        for (let i = 0; i < pointList.length; i = i + 2) {
            var currentPointX = pointList[i];
            var currentPointY = pointList[i + 1];
            minX = (currentPointX < minX || minX == null) ? currentPointX : minX;
            maxX = (currentPointX > maxX || maxX == null) ? currentPointX : maxX;
            minY = (currentPointY < minY || minY == null) ? currentPointY : minY;
            maxY = (currentPointY > maxY || maxY == null) ? currentPointY : maxY;

        }
        return [(minX + maxX) / 2, (minY + maxY) / 2];
    };

    getDistanceFromPoints(item) {
        var totalDistance = 0;
        for (let i = 0; i < item.length; i = i + 2) {
            if (i >= item.length - 2)
                break;

            var xA = item[i];
            var yA = item[i + 1];
            var xB = item[i + 2];
            var yB = item[i + 3];

            var xDiff = xA - xB;
            var yDiff = yA - yB;
            totalDistance = totalDistance + Math.sqrt(xDiff * xDiff + yDiff * yDiff);

        }
        // var xA = item.points[0];
        // var yA = item.points[1];
        // var xB = item.points[2];
        // var yB = item.points[3];

        // var xDiff = xA - xB;
        // var yDiff = yA - yB;

        return totalDistance;

    }

    getDistanceInPixel(xA, yA, xB, yB) {
        try {
            var xDiff = xA - xB;
            var yDiff = yA - yB;
            return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        } catch (error) { }
        return 0;
    };

    convertDistancePixelToMeter(distanceInPixel, scaleMeterForOnePixel) {
        var distainceInMeter = distanceInPixel * scaleMeterForOnePixel;
        distainceInMeter = Math.round(distainceInMeter * 1000) / 1000;
        return distainceInMeter;
    }


    convertDistanceMeterToPixel(distanceInMeter, scaleMeterForOnePixel) {
        var distanceInPixel = distanceInMeter / scaleMeterForOnePixel;
        return distanceInPixel;
    }
    getCenterPosition(point1, point2) {

        return [
            (point1[0] + point2[0]) / 2,
            (point1[1] + point2[1]) / 2
        ]

    }
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    hexToRgbArray(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16), 
            parseInt(result[2], 16), 
            parseInt(result[3], 16)] : [0, 0, 0];
    }

    getRoomDiagonalPoints(room) {
        if (room.points == null) return;

        var point1 = [];
        var point2 = [];
        var longest = 0;
        for (let i = 0; i < room.points.length; i = i + 2) {
            var currentPointX = room.points[i];
            var currentPointY = room.points[i + 1];

            for (let j = 0; j < room.points.length; j = j + 2) {
                var otherPointX = room.points[j];
                var otherPointY = room.points[j + 1];

                if (currentPointX == otherPointX && currentPointY == otherPointY)
                    continue;

                var distance = this.getDistanceInPixel(
                    currentPointX,
                    currentPointY,
                    otherPointX,
                    otherPointY
                );
                // var distance = 0;
                if (distance > longest) {
                    point1 = [currentPointX, currentPointY];
                    point2 = [otherPointX, otherPointY];
                    longest = distance;
                }
            }
        }
        return [point1[0], point1[1], point2[0], point2[1]];
    }

}

export default DrawingHelper;