import bacnetClassId from "./bacnetClassId";
import BacnetPropertyTranslationMap, { BACnetPropertyType } from "./bacnetPropertyType";
import networkService from "./networkService";
import request from "./request";
import systemService, { ServiceTypes, allServices } from './systemService';
import { translateUnit } from './constants';
export var registerType;
(function (registerType) {
    registerType["0X"] = "0x(Coil Status)";
    registerType["1X"] = "1x(Input Status)";
    registerType["4X"] = "4X(Holding Register)";
    registerType["3X"] = "3x(Input Register)";
})(registerType || (registerType = {}));
export class ObjectService {
    async getAttributes(reference) {
        return request({
            url: 'Object/GetItemAttributes',
            params: {
                reference
            }
        }).then((result) => {
            const attrs = result.data;
            const formatedAttrs = attrs.map(item => ({
                name: BacnetPropertyTranslationMap[item.viewPropertyId]?.() || item.viewPropertyName,
                value: this.getValueByType(item.itemValue, item.attrDataType, item.viewPropertyId),
                propertyId: item.viewPropertyId,
                dataTypeId: item.attrDataTypeID,
                dataType: item.attrDataType,
                itemValue: item.itemValue
            }));
            return formatedAttrs;
        });
    }
    /**
     * 返回 min, max, translationMap?
     */
    async getDetailObjectList(refList) {
        const networkItemsP = refList.map(ref => networkService.getNetworkItem(ref));
        return Promise.all(networkItemsP).then(networkItems => {
            return networkItems.map(item => {
                if (item) {
                    if (bacnetClassId.binaryValueTypes.indexOf(item.classId) > -1) {
                        return this.queryBinaryType(item);
                    }
                    else if (bacnetClassId.multistateValueTypes.indexOf(item.classId) > -1) {
                        return this.queryMuitistateType(item);
                    }
                    else if (bacnetClassId.analogValueTypes.indexOf(item.classId) > -1) {
                        return this.queryAnalogType(item);
                    }
                    else {
                        return {
                            ...item,
                            min: null,
                            max: null,
                        };
                    }
                }
            });
        }).then(detailPromise => {
            return Promise.all(detailPromise);
        });
    }
    async queryBinaryType(item) {
        const props = [
            BACnetPropertyType.propActiveText,
            BACnetPropertyType.propInactiveText,
        ];
        const queryP = props.map(prop => {
            return this.queryObjectAttributValue(item.reference, prop);
        });
        return Promise.all(queryP).then(([activeText, inactiveTest]) => ({
            ...item,
            min: 0,
            max: 1,
            translationMap: new Map([
                [0, inactiveTest],
                [1, activeText]
            ])
        }));
    }
    async queryMuitistateType(item) {
        return this.queryObjectAttributValue(item.reference, BACnetPropertyType.propStateText).then(stateText => {
            if (!stateText || stateText.length === 0) {
                return {
                    ...item,
                    min: 1,
                    max: 1,
                    translationMap: new Map([[1, '']])
                };
            }
            const translationMap = new Map(stateText.map((text, index) => [index + 1, text]));
            return {
                ...item,
                min: 1,
                max: stateText.length,
                translationMap
            };
        });
    }
    async queryAnalogType(item) {
        const props = [
            BACnetPropertyType.propMinValue,
            BACnetPropertyType.propMaxValue,
            BACnetPropertyType.propUnits,
        ];
        const queryP = props.map(prop => {
            return this.queryObjectAttributValue(item.reference, prop);
        });
        return Promise.all(queryP).then(([min, max, unit]) => ({
            ...item,
            min: min === '-2.1474836E+09' ? null : parseFloat(min),
            max: max === '2.1474836E+09' ? null : parseFloat(max),
            unit: unit
        }));
    }
    attributeQueryBuffer = [];
    async queryObjectAttributValue(ref, attrId) {
        this.attributeQueryBuffer.push({ reference: ref, propList: attrId.toString() });
        await Promise.resolve();
        const attributeQueryResult = await this.startQueryAttributes();
        const result = attributeQueryResult.get(ref + ',' + attrId);
        return result;
    }
    async getEnumSetById(id, lang) {
        return request({
            url: 'Object/GetEnumSetById',
            params: {
                enumSetId: id,
                localCulture: lang || 'en-us'
            }
        }).then((result) => {
            const data = result.data;
            return new Map(data.map(item => [item.id, item.text]));
        });
    }
    attrQueryPromise = Promise.resolve(new Map());
    async startQueryAttributes() {
        if (this.attributeQueryBuffer.length !== 0) {
            const tempBuffer = this.getUniqueArray(this.attributeQueryBuffer);
            this.attributeQueryBuffer.splice(0, this.attributeQueryBuffer.length);
            this.attrQueryPromise = this.attrQueryPromise.then(() => {
                return request({
                    url: 'Object/GetAttrsByMultiRefs',
                    method: 'post',
                    data: tempBuffer,
                });
            }).then((data) => {
                const attributeQueryResult = new Map();
                data.data.forEach((item) => {
                    attributeQueryResult.set(item.reference + ',' + item.viewPropertyId, this.getValueByType(item.itemValue, item.attrDataType, item.viewPropertyId));
                });
                return attributeQueryResult;
            });
        }
        return this.attrQueryPromise;
    }
    getUniqueArray(array) {
        const ret = array.concat([]);
        for (let i = 0; i < ret.length; i++) {
            const itemI = ret[i];
            for (let j = i + 1; j < ret.length; j++) {
                const itemJ = ret[j];
                if (itemI.reference === itemJ.reference && itemI.propList === itemJ.propList) {
                    ret.splice(j, 1);
                    j--;
                }
            }
        }
        return ret;
    }
    getValueByType(item, type, propId) {
        if (propId === BACnetPropertyType.propUnits) {
            return translateUnit(item.dataValue) || '-';
        }
        if (propId === BACnetPropertyType.propLogInterval) {
            return parseFloat(item.dataValue) / 100;
        }
        if (type === 'array' || type === 'listofObjref' || type === "listofUnsignedLong" || type === 'listofString' || type === 'listofBACoid') {
            return item.child?.map((c) => c.dataValue);
        }
        return item.dataValue;
    }
    async setPointDislayName(reference, name) {
        return request({
            url: 'Object/Rename',
            method: 'post',
            data: { reference, name }
        });
    }
    async createVObject(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: 'SystemPointAPI/CreatePoint',
            method: 'post',
            data: data
        });
    }
    async updateVObject(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.command),
            url: 'SystemPointAPI/UpdatePoint',
            method: 'post',
            data: data
        });
    }
    getEquipsName(references) {
        return request({
            url: 'Object/GetAttrsByMultiRefs',
            method: 'post',
            data: references.map(reference => ({
                reference,
                "proplist": "2390"
            })),
        });
    }
}
let objectService = allServices.get(ServiceTypes.object);
if (!objectService) {
    objectService = new ObjectService();
    allServices.set(ServiceTypes.object, objectService);
}
export default objectService;
//# sourceMappingURL=objectService.js.map