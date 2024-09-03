// lets describing logic
// mapobstacles is an arry representing  the descboard with its entities on the ctime of the turn activity 
// of the user

class basicPawn{
    constructor( pawnEntity, pawnColor, cPosition, existance, activeAwait, ...mapObstacles){
        this.pawnEntity = pawnEntity;
        this.pawnColor = pawnColor;
        this.cPosition = cPosition;
        this.existance = existance;
        this.activeAwait = activeAwait;
        this.oldPosition = oldPosition;

        this.mapObstacles = Array.from(mapObstacles);
        // Detect if the device is a mobile device (iOS or Android)
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? true : false;
        this.initializeEventListeners();
    }

    async restrictions(){
        if (this.existance && this.activeAwait){

        }
    }
}