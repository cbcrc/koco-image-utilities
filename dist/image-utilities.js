(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'knockout', 'lodash'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('knockout'), require('lodash'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.knockout, global.lodash);
        global.imageUtilities = mod.exports;
    }
})(this, function (exports, _knockout, _lodash) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _knockout2 = _interopRequireDefault(_knockout);

    var _lodash2 = _interopRequireDefault(_lodash);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // Copyright (c) CBC/Radio-Canada. All rights reserved.
    // Licensed under the MIT license. See LICENSE file in the project root for full license information.

    var imageUtilities = {};

    imageUtilities.defaultConcreteImageOptions = {
        preferedWidth: 480,
        preferedHeight: 270,
        preferedRatio: '16:9',
        defaultToClosestDimension: true
    };

    //scoop does not support float for widht & height
    //scoop only works with width since cloudinary scale relatively
    imageUtilities.getWidthTransformationFromCloudinaryUrl = function (url) {
        var myArray = url.match(/\/w_\d+\/v1\//gi);

        if (myArray && myArray.length) {
            var width = myArray[0].match(/\d+/g)[0];

            if (width) {
                return parseInt(width);
            }
        }

        return null;
    };

    imageUtilities.updateCloudinaryUrlWidthTransformation = function (url, width) {
        var result = url.replace('/v1/', "/w_" + width + '/v1/');

        return result;
    };

    imageUtilities.isConceptualImage = function (image) {
        return image && image.hasOwnProperty('concreteImages');
    };

    //Attention: 2 type de DefaultConcreteImage (1 pour les previews de scoop et celui ci pour le default concrete image...)
    //en ce moment on est chanceux, c'est la meme taille qui est utilisée par défaut mais il faudra ajuster si ca change
    imageUtilities.getDefaultConcreteImage = function (conceptualImage) {
        return imageUtilities.getConcreteImage(conceptualImage, imageUtilities.defaultConcreteImageOptions);
    };

    imageUtilities.getConcreteImage = function (conceptualImage, concreteImageOptions) {
        var self = this;
        concreteImageOptions = concreteImageOptions || self.defaultConcreteImageOptions;

        //concreteImageOptions = $.extend({}, imageUtilities.defaultConcreteImageOptions, concreteImageOptions);

        //TODO: Work with concreteImageOptions instead of dimensionOrFunction
        //TODO: Prendre en compte le cas ou on a un preferedHeight & preferedWidth mais pas de ratio... le cas existe :-(

        var concreteImage = null;

        //Find perfect fit
        if (concreteImageOptions.preferedWidth && concreteImageOptions.preferedHeight) {
            concreteImage = _knockout2.default.utils.arrayFirst(conceptualImage.concreteImages, function (item) {
                return item.width == concreteImageOptions.preferedWidth && item.height == concreteImageOptions.preferedHeight;
            });

            if (concreteImage || !concreteImageOptions.defaultToClosestDimension) {
                return concreteImage;
            }
        }

        //Ratio + (width or height) - also perfect fit
        if (concreteImageOptions.preferedRatio) {
            if (concreteImageOptions.preferedWidth || concreteImageOptions.preferedHeight) {
                if (concreteImageOptions.preferedWidth) {
                    concreteImage = _knockout2.default.utils.arrayFirst(conceptualImage.concreteImages, function (item) {
                        return item.width == concreteImageOptions.preferedWidth && item.dimensionRatio == concreteImageOptions.preferedRatio;
                    });

                    if (concreteImage || !concreteImageOptions.defaultToClosestDimension) {
                        return concreteImage;
                    }
                }

                if (concreteImageOptions.preferedHeight) {
                    concreteImage = _knockout2.default.utils.arrayFirst(conceptualImage.concreteImages, function (item) {
                        return item.height == concreteImageOptions.preferedHeight && item.dimensionRatio == concreteImageOptions.preferedRatio;
                    });

                    if (concreteImage || !concreteImageOptions.defaultToClosestDimension) {
                        return concreteImage;
                    }
                }
            } else if (!concreteImageOptions.defaultToClosestDimension) {
                return _knockout2.default.utils.arrayFirst(conceptualImage.concreteImages, function (item) {
                    return item.dimensionRatio == concreteImageOptions.preferedRatio;
                });
            }
        }

        //Still no concrete image found
        //No perfect fit & no defaultToClosestDimension
        if (!concreteImageOptions.defaultToClosestDimension) {
            return null;
        }

        if (concreteImageOptions.preferedRatio) {
            var sameRatioConcreteImages = _knockout2.default.utils.arrayFilter(conceptualImage.concreteImages, function (item) {
                return item.dimensionRatio == concreteImageOptions.preferedRatio;
            });

            if (sameRatioConcreteImages.length) {
                concreteImage = _lodash2.default.sortBy(sameRatioConcreteImages, function (item) {
                    return item.width || 0;
                }).reverse()[0];
            }
        }

        if (!concreteImage) {
            //return largest no matter the ratio
            concreteImage = _lodash2.default.sortBy(conceptualImage.concreteImages, function (item) {
                return item.width || 0;
            }).reverse()[0];
        }

        if (!concreteImage) {
            concreteImage = null;
        }

        return concreteImage;
    };

    imageUtilities.getHighResolutionAudioVideoConcreteImage = function (conceptualImage) {
        var concreteImage = _knockout2.default.utils.arrayFirst(conceptualImage.concreteImages, function (item) {
            return item.mediaLink.href.match(/\/hr\//i);
        });

        if (!concreteImage) {
            concreteImage = null;
        }

        return concreteImage;
    };

    imageUtilities.getLowResolutionAudioVideoConcreteImage = function (conceptualImage) {
        var concreteImage = _knockout2.default.utils.arrayFirst(conceptualImage.concreteImages, function (item) {
            return item.mediaLink.href.match(/\/br\//i);
        });

        if (!concreteImage) {
            concreteImage = null;
        }

        return concreteImage;
    };

    exports.default = imageUtilities;
});