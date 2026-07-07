import { t } from "./languages";
export var BACnetPropertyType;
(function (BACnetPropertyType) {
    BACnetPropertyType[BACnetPropertyType["propAckRequired"] = 1] = "propAckRequired";
    BACnetPropertyType[BACnetPropertyType["propAction"] = 2] = "propAction";
    BACnetPropertyType[BACnetPropertyType["propActionText"] = 3] = "propActionText";
    BACnetPropertyType[BACnetPropertyType["propActiveText"] = 4] = "propActiveText";
    BACnetPropertyType[BACnetPropertyType["propActiveVtSessions"] = 5] = "propActiveVtSessions";
    BACnetPropertyType[BACnetPropertyType["propAlarmValue"] = 6] = "propAlarmValue";
    BACnetPropertyType[BACnetPropertyType["propAlarmValues"] = 7] = "propAlarmValues";
    BACnetPropertyType[BACnetPropertyType["propAll"] = 8] = "propAll";
    BACnetPropertyType[BACnetPropertyType["propWritesSuccessful"] = 9] = "propWritesSuccessful";
    BACnetPropertyType[BACnetPropertyType["propApduSegmentTimeout"] = 10] = "propApduSegmentTimeout";
    BACnetPropertyType[BACnetPropertyType["propApduTimeout"] = 11] = "propApduTimeout";
    BACnetPropertyType[BACnetPropertyType["propApplSwVersion"] = 12] = "propApplSwVersion";
    BACnetPropertyType[BACnetPropertyType["propArchive"] = 13] = "propArchive";
    BACnetPropertyType[BACnetPropertyType["propBias"] = 14] = "propBias";
    BACnetPropertyType[BACnetPropertyType["propCosCount"] = 15] = "propCosCount";
    BACnetPropertyType[BACnetPropertyType["propCosTime"] = 16] = "propCosTime";
    BACnetPropertyType[BACnetPropertyType["propNotificationClass"] = 17] = "propNotificationClass";
    BACnetPropertyType[BACnetPropertyType["propControlledVarRef"] = 19] = "propControlledVarRef";
    BACnetPropertyType[BACnetPropertyType["propControlledVarUnits"] = 20] = "propControlledVarUnits";
    BACnetPropertyType[BACnetPropertyType["propControlledVarValue"] = 21] = "propControlledVarValue";
    BACnetPropertyType[BACnetPropertyType["propCovIncrement"] = 22] = "propCovIncrement";
    BACnetPropertyType[BACnetPropertyType["propDateList"] = 23] = "propDateList";
    BACnetPropertyType[BACnetPropertyType["propDstStatus"] = 24] = "propDstStatus";
    BACnetPropertyType[BACnetPropertyType["propBacnetDeadband"] = 25] = "propBacnetDeadband";
    BACnetPropertyType[BACnetPropertyType["propDerivativeConstant"] = 26] = "propDerivativeConstant";
    BACnetPropertyType[BACnetPropertyType["propDerivativeConUnits"] = 27] = "propDerivativeConUnits";
    BACnetPropertyType[BACnetPropertyType["propDescription"] = 28] = "propDescription";
    BACnetPropertyType[BACnetPropertyType["propDescriptionOfHalt"] = 29] = "propDescriptionOfHalt";
    BACnetPropertyType[BACnetPropertyType["propDeviceAddrBinding"] = 30] = "propDeviceAddrBinding";
    BACnetPropertyType[BACnetPropertyType["propDeviceType"] = 31] = "propDeviceType";
    BACnetPropertyType[BACnetPropertyType["propEffectivePeriod"] = 32] = "propEffectivePeriod";
    BACnetPropertyType[BACnetPropertyType["propElapsedActiveTime"] = 33] = "propElapsedActiveTime";
    BACnetPropertyType[BACnetPropertyType["propErrorLimit"] = 34] = "propErrorLimit";
    BACnetPropertyType[BACnetPropertyType["propEventEnable"] = 35] = "propEventEnable";
    BACnetPropertyType[BACnetPropertyType["propEventState"] = 36] = "propEventState";
    BACnetPropertyType[BACnetPropertyType["propEventType"] = 37] = "propEventType";
    BACnetPropertyType[BACnetPropertyType["propExceptionSchedule"] = 38] = "propExceptionSchedule";
    BACnetPropertyType[BACnetPropertyType["propFaultValues"] = 39] = "propFaultValues";
    BACnetPropertyType[BACnetPropertyType["propFeedbackValue"] = 40] = "propFeedbackValue";
    BACnetPropertyType[BACnetPropertyType["propFileAccessMethod"] = 41] = "propFileAccessMethod";
    BACnetPropertyType[BACnetPropertyType["propFileSize"] = 42] = "propFileSize";
    BACnetPropertyType[BACnetPropertyType["propFileType"] = 43] = "propFileType";
    BACnetPropertyType[BACnetPropertyType["propFirmwareVersion"] = 44] = "propFirmwareVersion";
    BACnetPropertyType[BACnetPropertyType["propHighLimit"] = 45] = "propHighLimit";
    BACnetPropertyType[BACnetPropertyType["propInactiveText"] = 46] = "propInactiveText";
    BACnetPropertyType[BACnetPropertyType["propInProcess"] = 47] = "propInProcess";
    BACnetPropertyType[BACnetPropertyType["propInstanceOf"] = 48] = "propInstanceOf";
    BACnetPropertyType[BACnetPropertyType["propIntegralConstant"] = 49] = "propIntegralConstant";
    BACnetPropertyType[BACnetPropertyType["propIntegralConstUnits"] = 50] = "propIntegralConstUnits";
    BACnetPropertyType[BACnetPropertyType["propLimitEnable"] = 52] = "propLimitEnable";
    BACnetPropertyType[BACnetPropertyType["propListOfGroupMembers"] = 53] = "propListOfGroupMembers";
    BACnetPropertyType[BACnetPropertyType["propListOfPropRefs"] = 54] = "propListOfPropRefs";
    BACnetPropertyType[BACnetPropertyType["propListOfSessionKeys"] = 55] = "propListOfSessionKeys";
    BACnetPropertyType[BACnetPropertyType["propLocalDate"] = 56] = "propLocalDate";
    BACnetPropertyType[BACnetPropertyType["propLocalTime"] = 57] = "propLocalTime";
    BACnetPropertyType[BACnetPropertyType["propLocation"] = 58] = "propLocation";
    BACnetPropertyType[BACnetPropertyType["propLowLimit"] = 59] = "propLowLimit";
    BACnetPropertyType[BACnetPropertyType["propManipulatedVarRef"] = 60] = "propManipulatedVarRef";
    BACnetPropertyType[BACnetPropertyType["propMaxOutput"] = 61] = "propMaxOutput";
    BACnetPropertyType[BACnetPropertyType["propMaxApduLength"] = 62] = "propMaxApduLength";
    BACnetPropertyType[BACnetPropertyType["propMaxInfoFrames"] = 63] = "propMaxInfoFrames";
    BACnetPropertyType[BACnetPropertyType["propMaxMaster"] = 64] = "propMaxMaster";
    BACnetPropertyType[BACnetPropertyType["propMaxValue"] = 65] = "propMaxValue";
    BACnetPropertyType[BACnetPropertyType["propMinOffTime"] = 66] = "propMinOffTime";
    BACnetPropertyType[BACnetPropertyType["propMinOnTime"] = 67] = "propMinOnTime";
    BACnetPropertyType[BACnetPropertyType["propMinOutput"] = 68] = "propMinOutput";
    BACnetPropertyType[BACnetPropertyType["propMinValue"] = 69] = "propMinValue";
    BACnetPropertyType[BACnetPropertyType["propModelName"] = 70] = "propModelName";
    BACnetPropertyType[BACnetPropertyType["propModificationDate"] = 71] = "propModificationDate";
    BACnetPropertyType[BACnetPropertyType["propNotifyType"] = 72] = "propNotifyType";
    BACnetPropertyType[BACnetPropertyType["propApduRetries"] = 73] = "propApduRetries";
    BACnetPropertyType[BACnetPropertyType["propNumberOfStates"] = 74] = "propNumberOfStates";
    BACnetPropertyType[BACnetPropertyType["propObjectIdentifier"] = 75] = "propObjectIdentifier";
    BACnetPropertyType[BACnetPropertyType["propObjectList"] = 76] = "propObjectList";
    BACnetPropertyType[BACnetPropertyType["propObjectName"] = 77] = "propObjectName";
    BACnetPropertyType[BACnetPropertyType["propObjectPropertyRef"] = 78] = "propObjectPropertyRef";
    BACnetPropertyType[BACnetPropertyType["propObjectType"] = 79] = "propObjectType";
    BACnetPropertyType[BACnetPropertyType["propOutOfService"] = 81] = "propOutOfService";
    BACnetPropertyType[BACnetPropertyType["propOutputUnits"] = 82] = "propOutputUnits";
    BACnetPropertyType[BACnetPropertyType["propEventParameters"] = 83] = "propEventParameters";
    BACnetPropertyType[BACnetPropertyType["propPolarity"] = 84] = "propPolarity";
    BACnetPropertyType[BACnetPropertyType["propPresentValue"] = 85] = "propPresentValue";
    BACnetPropertyType[BACnetPropertyType["propPriority"] = 86] = "propPriority";
    BACnetPropertyType[BACnetPropertyType["propPriorityArray"] = 87] = "propPriorityArray";
    BACnetPropertyType[BACnetPropertyType["propPriorityForWriting"] = 88] = "propPriorityForWriting";
    BACnetPropertyType[BACnetPropertyType["propProcessIdentifier"] = 89] = "propProcessIdentifier";
    BACnetPropertyType[BACnetPropertyType["propProgramChange"] = 90] = "propProgramChange";
    BACnetPropertyType[BACnetPropertyType["propProgramLocation"] = 91] = "propProgramLocation";
    BACnetPropertyType[BACnetPropertyType["propProgramState"] = 92] = "propProgramState";
    BACnetPropertyType[BACnetPropertyType["propProportionalConst"] = 93] = "propProportionalConst";
    BACnetPropertyType[BACnetPropertyType["propPropConstantUnits"] = 94] = "propPropConstantUnits";
    BACnetPropertyType[BACnetPropertyType["propProtocolObjSupport"] = 96] = "propProtocolObjSupport";
    BACnetPropertyType[BACnetPropertyType["propProtocolSerSupport"] = 97] = "propProtocolSerSupport";
    BACnetPropertyType[BACnetPropertyType["propProtocolVersion"] = 98] = "propProtocolVersion";
    BACnetPropertyType[BACnetPropertyType["propReadOnly"] = 99] = "propReadOnly";
    BACnetPropertyType[BACnetPropertyType["propReasonForHalt"] = 100] = "propReasonForHalt";
    BACnetPropertyType[BACnetPropertyType["propRecipientList"] = 102] = "propRecipientList";
    BACnetPropertyType[BACnetPropertyType["propReliability"] = 103] = "propReliability";
    BACnetPropertyType[BACnetPropertyType["propRelinquishDefault"] = 104] = "propRelinquishDefault";
    BACnetPropertyType[BACnetPropertyType["propResolution"] = 106] = "propResolution";
    BACnetPropertyType[BACnetPropertyType["propSegmentation"] = 107] = "propSegmentation";
    BACnetPropertyType[BACnetPropertyType["propSetpoint"] = 108] = "propSetpoint";
    BACnetPropertyType[BACnetPropertyType["propSetpointReference"] = 109] = "propSetpointReference";
    BACnetPropertyType[BACnetPropertyType["propStateText"] = 110] = "propStateText";
    BACnetPropertyType[BACnetPropertyType["propStatusFlags"] = 111] = "propStatusFlags";
    BACnetPropertyType[BACnetPropertyType["propSystemStatus"] = 112] = "propSystemStatus";
    BACnetPropertyType[BACnetPropertyType["propTimeDelay"] = 113] = "propTimeDelay";
    BACnetPropertyType[BACnetPropertyType["propActiveTimeReset"] = 114] = "propActiveTimeReset";
    BACnetPropertyType[BACnetPropertyType["propStateCountReset"] = 115] = "propStateCountReset";
    BACnetPropertyType[BACnetPropertyType["propTimeSyncRecipients"] = 116] = "propTimeSyncRecipients";
    BACnetPropertyType[BACnetPropertyType["propUnits"] = 117] = "propUnits";
    BACnetPropertyType[BACnetPropertyType["propUpdateInterval"] = 118] = "propUpdateInterval";
    BACnetPropertyType[BACnetPropertyType["propUtcOffset"] = 119] = "propUtcOffset";
    BACnetPropertyType[BACnetPropertyType["propVendorId"] = 120] = "propVendorId";
    BACnetPropertyType[BACnetPropertyType["propVendorName"] = 121] = "propVendorName";
    BACnetPropertyType[BACnetPropertyType["propVtClassesSupported"] = 122] = "propVtClassesSupported";
    BACnetPropertyType[BACnetPropertyType["propWeeklySchedule"] = 123] = "propWeeklySchedule";
    BACnetPropertyType[BACnetPropertyType["propAttemptedSamples"] = 124] = "propAttemptedSamples";
    BACnetPropertyType[BACnetPropertyType["propAverageValue"] = 125] = "propAverageValue";
    BACnetPropertyType[BACnetPropertyType["propBufferSize"] = 126] = "propBufferSize";
    BACnetPropertyType[BACnetPropertyType["propClientCovIncrement"] = 127] = "propClientCovIncrement";
    BACnetPropertyType[BACnetPropertyType["propCovResubscInterval"] = 128] = "propCovResubscInterval";
    BACnetPropertyType[BACnetPropertyType["propEventTimeStamps"] = 130] = "propEventTimeStamps";
    BACnetPropertyType[BACnetPropertyType["propLogBuffer"] = 131] = "propLogBuffer";
    BACnetPropertyType[BACnetPropertyType["propLogDeviceObjectProperty"] = 132] = "propLogDeviceObjectProperty";
    BACnetPropertyType[BACnetPropertyType["propEnable"] = 133] = "propEnable";
    BACnetPropertyType[BACnetPropertyType["propLogInterval"] = 134] = "propLogInterval";
    BACnetPropertyType[BACnetPropertyType["propMaximumValue"] = 135] = "propMaximumValue";
    BACnetPropertyType[BACnetPropertyType["propMinimumValue"] = 136] = "propMinimumValue";
    BACnetPropertyType[BACnetPropertyType["propNotifyThreshold"] = 137] = "propNotifyThreshold";
    BACnetPropertyType[BACnetPropertyType["propProtocolRevision"] = 139] = "propProtocolRevision";
    BACnetPropertyType[BACnetPropertyType["propRecordsSinceNotify"] = 140] = "propRecordsSinceNotify";
    BACnetPropertyType[BACnetPropertyType["propRecordCount"] = 141] = "propRecordCount";
    BACnetPropertyType[BACnetPropertyType["propStartTime"] = 142] = "propStartTime";
    BACnetPropertyType[BACnetPropertyType["propStopTime"] = 143] = "propStopTime";
    BACnetPropertyType[BACnetPropertyType["propStopWhenFull"] = 144] = "propStopWhenFull";
    BACnetPropertyType[BACnetPropertyType["propTotalRecordCount"] = 145] = "propTotalRecordCount";
    BACnetPropertyType[BACnetPropertyType["propValidSamples"] = 146] = "propValidSamples";
    BACnetPropertyType[BACnetPropertyType["propWindowInterval"] = 147] = "propWindowInterval";
    BACnetPropertyType[BACnetPropertyType["propWindowSamples"] = 148] = "propWindowSamples";
    BACnetPropertyType[BACnetPropertyType["propMaxValueTimestamp"] = 149] = "propMaxValueTimestamp";
    BACnetPropertyType[BACnetPropertyType["propMinValueTimestamp"] = 150] = "propMinValueTimestamp";
    BACnetPropertyType[BACnetPropertyType["propActiveCovSubscriptions"] = 152] = "propActiveCovSubscriptions";
    BACnetPropertyType[BACnetPropertyType["propBackupFailTimeout"] = 153] = "propBackupFailTimeout";
    BACnetPropertyType[BACnetPropertyType["propConfigurationFiles"] = 154] = "propConfigurationFiles";
    BACnetPropertyType[BACnetPropertyType["propDatabaseRevision"] = 155] = "propDatabaseRevision";
    BACnetPropertyType[BACnetPropertyType["propDirectReading"] = 156] = "propDirectReading";
    BACnetPropertyType[BACnetPropertyType["propLastRestoreTime"] = 157] = "propLastRestoreTime";
    BACnetPropertyType[BACnetPropertyType["propMaintenanceRequired"] = 158] = "propMaintenanceRequired";
    BACnetPropertyType[BACnetPropertyType["propMemberOf"] = 159] = "propMemberOf";
    BACnetPropertyType[BACnetPropertyType["propLifeSafetyMode"] = 160] = "propLifeSafetyMode";
    BACnetPropertyType[BACnetPropertyType["propOperationExpected"] = 161] = "propOperationExpected";
    BACnetPropertyType[BACnetPropertyType["propSetting"] = 162] = "propSetting";
    BACnetPropertyType[BACnetPropertyType["propSilenced"] = 163] = "propSilenced";
    BACnetPropertyType[BACnetPropertyType["propTrackingValue"] = 164] = "propTrackingValue";
    BACnetPropertyType[BACnetPropertyType["propZoneMembers"] = 165] = "propZoneMembers";
    BACnetPropertyType[BACnetPropertyType["propLifeSafetyAlarmValues"] = 166] = "propLifeSafetyAlarmValues";
    BACnetPropertyType[BACnetPropertyType["propMaxSegmentsAccpt"] = 167] = "propMaxSegmentsAccpt";
    BACnetPropertyType[BACnetPropertyType["propProfileName"] = 168] = "propProfileName";
    BACnetPropertyType[BACnetPropertyType["propLastNotifyRecord"] = 173] = "propLastNotifyRecord";
    BACnetPropertyType[BACnetPropertyType["propDefaultScheduleCommand"] = 174] = "propDefaultScheduleCommand";
    BACnetPropertyType[BACnetPropertyType["propAcceptedModes"] = 175] = "propAcceptedModes";
    BACnetPropertyType[BACnetPropertyType["propDecrementPresentValue"] = 176] = "propDecrementPresentValue";
    BACnetPropertyType[BACnetPropertyType["propPulseCount"] = 177] = "propPulseCount";
    BACnetPropertyType[BACnetPropertyType["propCountBeforeDecrement"] = 178] = "propCountBeforeDecrement";
    BACnetPropertyType[BACnetPropertyType["propCountChangeTime"] = 179] = "propCountChangeTime";
    BACnetPropertyType[BACnetPropertyType["propCovPeriod"] = 180] = "propCovPeriod";
    BACnetPropertyType[BACnetPropertyType["propPulseReference"] = 181] = "propPulseReference";
    BACnetPropertyType[BACnetPropertyType["propLimitMonitoringInterval"] = 182] = "propLimitMonitoringInterval";
    BACnetPropertyType[BACnetPropertyType["propLoggingObjectReference"] = 183] = "propLoggingObjectReference";
    BACnetPropertyType[BACnetPropertyType["propLoggingRecord"] = 184] = "propLoggingRecord";
    BACnetPropertyType[BACnetPropertyType["propPrescale"] = 185] = "propPrescale";
    BACnetPropertyType[BACnetPropertyType["propPulseRate"] = 186] = "propPulseRate";
    BACnetPropertyType[BACnetPropertyType["propScale"] = 187] = "propScale";
    BACnetPropertyType[BACnetPropertyType["propPulseScaleFactor"] = 188] = "propPulseScaleFactor";
    BACnetPropertyType[BACnetPropertyType["propUpdateTime"] = 189] = "propUpdateTime";
    BACnetPropertyType[BACnetPropertyType["propValueBeforeChange"] = 190] = "propValueBeforeChange";
    BACnetPropertyType[BACnetPropertyType["propValueSet"] = 191] = "propValueSet";
    BACnetPropertyType[BACnetPropertyType["propValueChangeTime"] = 192] = "propValueChangeTime";
    BACnetPropertyType[BACnetPropertyType["propAlignIntervals"] = 193] = "propAlignIntervals";
    BACnetPropertyType[BACnetPropertyType["propIntervalOffset"] = 195] = "propIntervalOffset";
    BACnetPropertyType[BACnetPropertyType["propLastRestartReason"] = 196] = "propLastRestartReason";
    BACnetPropertyType[BACnetPropertyType["propLoggingType"] = 197] = "propLoggingType";
    BACnetPropertyType[BACnetPropertyType["propRestartNotificationRecipient"] = 202] = "propRestartNotificationRecipient";
    BACnetPropertyType[BACnetPropertyType["propTimeOfDeviceRestart"] = 203] = "propTimeOfDeviceRestart";
    BACnetPropertyType[BACnetPropertyType["propTimeSynchronizationInterval"] = 204] = "propTimeSynchronizationInterval";
    BACnetPropertyType[BACnetPropertyType["propTrigger"] = 205] = "propTrigger";
    BACnetPropertyType[BACnetPropertyType["propUtcTimeSynchronizationRecip"] = 206] = "propUtcTimeSynchronizationRecip";
    BACnetPropertyType[BACnetPropertyType["propSubordinateList"] = 211] = "propSubordinateList";
    BACnetPropertyType[BACnetPropertyType["propActualShedLevel"] = 212] = "propActualShedLevel";
    BACnetPropertyType[BACnetPropertyType["propDutyWindow"] = 213] = "propDutyWindow";
    BACnetPropertyType[BACnetPropertyType["propExpectedShedLevel"] = 214] = "propExpectedShedLevel";
    BACnetPropertyType[BACnetPropertyType["propFullDutyBaseline"] = 215] = "propFullDutyBaseline";
    BACnetPropertyType[BACnetPropertyType["propRequestedShedLevel"] = 218] = "propRequestedShedLevel";
    BACnetPropertyType[BACnetPropertyType["propShedDuration"] = 219] = "propShedDuration";
    BACnetPropertyType[BACnetPropertyType["propShedLevelDescriptions"] = 220] = "propShedLevelDescriptions";
    BACnetPropertyType[BACnetPropertyType["propShedLevels"] = 221] = "propShedLevels";
    BACnetPropertyType[BACnetPropertyType["propStateDescription"] = 222] = "propStateDescription";
    BACnetPropertyType[BACnetPropertyType["propAuthenticationStatus"] = 260] = "propAuthenticationStatus";
    BACnetPropertyType[BACnetPropertyType["propDeviceId"] = 295] = "propDeviceId";
    BACnetPropertyType[BACnetPropertyType["propObjectId"] = 296] = "propObjectId";
    BACnetPropertyType[BACnetPropertyType["propBackupAndRestoreState"] = 338] = "propBackupAndRestoreState";
    BACnetPropertyType[BACnetPropertyType["propBackupPreparationTime"] = 339] = "propBackupPreparationTime";
    BACnetPropertyType[BACnetPropertyType["propRestoreCompletionTime"] = 340] = "propRestoreCompletionTime";
    BACnetPropertyType[BACnetPropertyType["propRestorePreparationTime"] = 341] = "propRestorePreparationTime";
    BACnetPropertyType[BACnetPropertyType["propBitMask"] = 342] = "propBitMask";
    BACnetPropertyType[BACnetPropertyType["propBitText"] = 343] = "propBitText";
    BACnetPropertyType[BACnetPropertyType["propIsUtc"] = 344] = "propIsUtc";
    BACnetPropertyType[BACnetPropertyType["propEventMessageTexts"] = 351] = "propEventMessageTexts";
    BACnetPropertyType[BACnetPropertyType["propEventMessageTextsConfig"] = 352] = "propEventMessageTextsConfig";
    BACnetPropertyType[BACnetPropertyType["propEventDetectionEnable"] = 353] = "propEventDetectionEnable";
    BACnetPropertyType[BACnetPropertyType["propExecutionDelay"] = 368] = "propExecutionDelay";
    BACnetPropertyType[BACnetPropertyType["propLastPriority"] = 369] = "propLastPriority";
    BACnetPropertyType[BACnetPropertyType["propWriteStatus"] = 370] = "propWriteStatus";
    BACnetPropertyType[BACnetPropertyType["propPropertyList"] = 371] = "propPropertyList";
    BACnetPropertyType[BACnetPropertyType["propBlinkWarnEnable"] = 373] = "propBlinkWarnEnable";
    BACnetPropertyType[BACnetPropertyType["propDefaultFadeTime"] = 374] = "propDefaultFadeTime";
    BACnetPropertyType[BACnetPropertyType["propDefaultRampRate"] = 375] = "propDefaultRampRate";
    BACnetPropertyType[BACnetPropertyType["propDefaultStepIncrement"] = 376] = "propDefaultStepIncrement";
    BACnetPropertyType[BACnetPropertyType["propEgressTime"] = 377] = "propEgressTime";
    BACnetPropertyType[BACnetPropertyType["propInProgress"] = 378] = "propInProgress";
    BACnetPropertyType[BACnetPropertyType["propInstantaneousPower"] = 379] = "propInstantaneousPower";
    BACnetPropertyType[BACnetPropertyType["propLightingCommand"] = 380] = "propLightingCommand";
    BACnetPropertyType[BACnetPropertyType["propLightingCommandDefaultPrior"] = 381] = "propLightingCommandDefaultPrior";
    BACnetPropertyType[BACnetPropertyType["propMaxActualValue"] = 382] = "propMaxActualValue";
    BACnetPropertyType[BACnetPropertyType["propMinActualValue"] = 383] = "propMinActualValue";
    BACnetPropertyType[BACnetPropertyType["propPower"] = 384] = "propPower";
    BACnetPropertyType[BACnetPropertyType["propTransition"] = 385] = "propTransition";
    BACnetPropertyType[BACnetPropertyType["propEgressActive"] = 386] = "propEgressActive";
    BACnetPropertyType[BACnetPropertyType["propApduLength"] = 399] = "propApduLength";
    BACnetPropertyType[BACnetPropertyType["propIpAddress"] = 400] = "propIpAddress";
    BACnetPropertyType[BACnetPropertyType["propIpDefaultGateway"] = 401] = "propIpDefaultGateway";
    BACnetPropertyType[BACnetPropertyType["propIpDhcpEnable"] = 402] = "propIpDhcpEnable";
    BACnetPropertyType[BACnetPropertyType["propIpDnsServer"] = 406] = "propIpDnsServer";
    BACnetPropertyType[BACnetPropertyType["propBacnetIpMode"] = 408] = "propBacnetIpMode";
    BACnetPropertyType[BACnetPropertyType["propIpSubnetMask"] = 411] = "propIpSubnetMask";
    BACnetPropertyType[BACnetPropertyType["propBacnetIpUdpPort"] = 412] = "propBacnetIpUdpPort";
    BACnetPropertyType[BACnetPropertyType["propBbmdAcceptFDRegistration"] = 413] = "propBbmdAcceptFDRegistration";
    BACnetPropertyType[BACnetPropertyType["propBbmdBroadcastDistributionTa"] = 414] = "propBbmdBroadcastDistributionTa";
    BACnetPropertyType[BACnetPropertyType["propBbmdForeignDeviceTable"] = 415] = "propBbmdForeignDeviceTable";
    BACnetPropertyType[BACnetPropertyType["propChangesPending"] = 416] = "propChangesPending";
    BACnetPropertyType[BACnetPropertyType["propCommand"] = 417] = "propCommand";
    BACnetPropertyType[BACnetPropertyType["propLinkSpeed"] = 420] = "propLinkSpeed";
    BACnetPropertyType[BACnetPropertyType["propLinkSpeedAutonegotiate"] = 422] = "propLinkSpeedAutonegotiate";
    BACnetPropertyType[BACnetPropertyType["propMacAddress"] = 423] = "propMacAddress";
    BACnetPropertyType[BACnetPropertyType["propPendingNetworkNumber"] = 425] = "propPendingNetworkNumber";
    BACnetPropertyType[BACnetPropertyType["propNetworkNumberQuality"] = 426] = "propNetworkNumberQuality";
    BACnetPropertyType[BACnetPropertyType["propNetworkType"] = 427] = "propNetworkType";
    BACnetPropertyType[BACnetPropertyType["propCurrentCommandPriority"] = 431] = "propCurrentCommandPriority";
    BACnetPropertyType[BACnetPropertyType["propProtocolLevel"] = 482] = "propProtocolLevel";
    BACnetPropertyType[BACnetPropertyType["propStatus"] = 512] = "propStatus";
    BACnetPropertyType[BACnetPropertyType["propInput"] = 513] = "propInput";
    BACnetPropertyType[BACnetPropertyType["propBtlMax"] = 514] = "propBtlMax";
    BACnetPropertyType[BACnetPropertyType["propPeriod"] = 515] = "propPeriod";
    BACnetPropertyType[BACnetPropertyType["propHeavyEquipDelay"] = 516] = "propHeavyEquipDelay";
    BACnetPropertyType[BACnetPropertyType["propHedController"] = 517] = "propHedController";
    BACnetPropertyType[BACnetPropertyType["propSetup"] = 518] = "propSetup";
    BACnetPropertyType[BACnetPropertyType["propSlot"] = 519] = "propSlot";
    BACnetPropertyType[BACnetPropertyType["propWarningAckRequired"] = 520] = "propWarningAckRequired";
    BACnetPropertyType[BACnetPropertyType["propWarningAckPending"] = 521] = "propWarningAckPending";
    BACnetPropertyType[BACnetPropertyType["propWarningTime"] = 522] = "propWarningTime";
    BACnetPropertyType[BACnetPropertyType["propWarningDate"] = 523] = "propWarningDate";
    BACnetPropertyType[BACnetPropertyType["propWarningPriority"] = 524] = "propWarningPriority";
    BACnetPropertyType[BACnetPropertyType["propNormalAckRequired"] = 525] = "propNormalAckRequired";
    BACnetPropertyType[BACnetPropertyType["propNormalAckPending"] = 526] = "propNormalAckPending";
    BACnetPropertyType[BACnetPropertyType["propNormalTime"] = 527] = "propNormalTime";
    BACnetPropertyType[BACnetPropertyType["propNormalDate"] = 528] = "propNormalDate";
    BACnetPropertyType[BACnetPropertyType["propNormalPriority"] = 529] = "propNormalPriority";
    BACnetPropertyType[BACnetPropertyType["propAlarmAckRequired"] = 530] = "propAlarmAckRequired";
    BACnetPropertyType[BACnetPropertyType["propAlarmAckPending"] = 531] = "propAlarmAckPending";
    BACnetPropertyType[BACnetPropertyType["propAlarmTime"] = 532] = "propAlarmTime";
    BACnetPropertyType[BACnetPropertyType["propAlarmDate"] = 533] = "propAlarmDate";
    BACnetPropertyType[BACnetPropertyType["propAlarmPriority"] = 534] = "propAlarmPriority";
    BACnetPropertyType[BACnetPropertyType["propAlarmMessageText"] = 536] = "propAlarmMessageText";
    BACnetPropertyType[BACnetPropertyType["propRemoteNetworkAddr"] = 537] = "propRemoteNetworkAddr";
    BACnetPropertyType[BACnetPropertyType["propRemoteDeviceAddr"] = 538] = "propRemoteDeviceAddr";
    BACnetPropertyType[BACnetPropertyType["propExamStructure"] = 540] = "propExamStructure";
    BACnetPropertyType[BACnetPropertyType["propBroadcastDisabled"] = 541] = "propBroadcastDisabled";
    BACnetPropertyType[BACnetPropertyType["propBmAddressList"] = 542] = "propBmAddressList";
    BACnetPropertyType[BACnetPropertyType["propMemoryAddressStyle"] = 543] = "propMemoryAddressStyle";
    BACnetPropertyType[BACnetPropertyType["propReference"] = 544] = "propReference";
    BACnetPropertyType[BACnetPropertyType["propInputRef"] = 545] = "propInputRef";
    BACnetPropertyType[BACnetPropertyType["propTime"] = 547] = "propTime";
    BACnetPropertyType[BACnetPropertyType["propDate"] = 548] = "propDate";
    BACnetPropertyType[BACnetPropertyType["propTrunkNumber"] = 549] = "propTrunkNumber";
    BACnetPropertyType[BACnetPropertyType["propLogicEquation"] = 550] = "propLogicEquation";
    BACnetPropertyType[BACnetPropertyType["propReferenceDelayTime"] = 551] = "propReferenceDelayTime";
    BACnetPropertyType[BACnetPropertyType["propReferenceDelayTimerActive"] = 552] = "propReferenceDelayTimerActive";
    BACnetPropertyType[BACnetPropertyType["propMaxCovSubscriptions"] = 553] = "propMaxCovSubscriptions";
    BACnetPropertyType[BACnetPropertyType["propRestartTrigger"] = 558] = "propRestartTrigger";
    BACnetPropertyType[BACnetPropertyType["propStartup"] = 559] = "propStartup";
    BACnetPropertyType[BACnetPropertyType["propShutdown"] = 560] = "propShutdown";
    BACnetPropertyType[BACnetPropertyType["propAutoRestore"] = 561] = "propAutoRestore";
    BACnetPropertyType[BACnetPropertyType["propErrorSource"] = 562] = "propErrorSource";
    BACnetPropertyType[BACnetPropertyType["propUserInformation"] = 563] = "propUserInformation";
    BACnetPropertyType[BACnetPropertyType["propChildList"] = 564] = "propChildList";
    BACnetPropertyType[BACnetPropertyType["propExecutionState"] = 565] = "propExecutionState";
    BACnetPropertyType[BACnetPropertyType["propExecutionTrigger"] = 566] = "propExecutionTrigger";
    BACnetPropertyType[BACnetPropertyType["propSubscribeCovCount"] = 567] = "propSubscribeCovCount";
    BACnetPropertyType[BACnetPropertyType["propExecutionCount"] = 568] = "propExecutionCount";
    BACnetPropertyType[BACnetPropertyType["propIntrinsicAlarmingDefined"] = 569] = "propIntrinsicAlarmingDefined";
    BACnetPropertyType[BACnetPropertyType["propExecutionTime"] = 570] = "propExecutionTime";
    BACnetPropertyType[BACnetPropertyType["propSurrogateCacheCnt"] = 571] = "propSurrogateCacheCnt";
    BACnetPropertyType[BACnetPropertyType["propSubscribeCovPropertyCount"] = 573] = "propSubscribeCovPropertyCount";
    BACnetPropertyType[BACnetPropertyType["propSubscriptionsReceived"] = 574] = "propSubscriptionsReceived";
    BACnetPropertyType[BACnetPropertyType["propErrorStatus"] = 576] = "propErrorStatus";
    BACnetPropertyType[BACnetPropertyType["propCovNotificationsPerMinute"] = 577] = "propCovNotificationsPerMinute";
    BACnetPropertyType[BACnetPropertyType["propSendIAmRate"] = 579] = "propSendIAmRate";
    BACnetPropertyType[BACnetPropertyType["propIgnoreRelinquishDefault"] = 580] = "propIgnoreRelinquishDefault";
    BACnetPropertyType[BACnetPropertyType["propConfReqTx"] = 581] = "propConfReqTx";
    BACnetPropertyType[BACnetPropertyType["propConfReqRcv"] = 582] = "propConfReqRcv";
    BACnetPropertyType[BACnetPropertyType["propSegConfReqTx"] = 583] = "propSegConfReqTx";
    BACnetPropertyType[BACnetPropertyType["propSegConfReqRcv"] = 584] = "propSegConfReqRcv";
    BACnetPropertyType[BACnetPropertyType["propAckTx"] = 585] = "propAckTx";
    BACnetPropertyType[BACnetPropertyType["propAckRcv"] = 586] = "propAckRcv";
    BACnetPropertyType[BACnetPropertyType["propSegAckTx"] = 587] = "propSegAckTx";
    BACnetPropertyType[BACnetPropertyType["propSegAckRcv"] = 588] = "propSegAckRcv";
    BACnetPropertyType[BACnetPropertyType["propSimpleAckTx"] = 589] = "propSimpleAckTx";
    BACnetPropertyType[BACnetPropertyType["propSimpleAckRcv"] = 590] = "propSimpleAckRcv";
    BACnetPropertyType[BACnetPropertyType["propSegmentAckTx"] = 591] = "propSegmentAckTx";
    BACnetPropertyType[BACnetPropertyType["propSegmentAckRcv"] = 592] = "propSegmentAckRcv";
    BACnetPropertyType[BACnetPropertyType["propUnconfirmedTx"] = 593] = "propUnconfirmedTx";
    BACnetPropertyType[BACnetPropertyType["propUnconfirmedRcv"] = 594] = "propUnconfirmedRcv";
    BACnetPropertyType[BACnetPropertyType["propErrorTx"] = 595] = "propErrorTx";
    BACnetPropertyType[BACnetPropertyType["propErrorRcv"] = 596] = "propErrorRcv";
    BACnetPropertyType[BACnetPropertyType["propRejectTx"] = 597] = "propRejectTx";
    BACnetPropertyType[BACnetPropertyType["propRejectRcv"] = 598] = "propRejectRcv";
    BACnetPropertyType[BACnetPropertyType["propAbortTx"] = 599] = "propAbortTx";
    BACnetPropertyType[BACnetPropertyType["propPulseWidth"] = 600] = "propPulseWidth";
    BACnetPropertyType[BACnetPropertyType["propAbortRcv"] = 602] = "propAbortRcv";
    BACnetPropertyType[BACnetPropertyType["propSegmentTx"] = 605] = "propSegmentTx";
    BACnetPropertyType[BACnetPropertyType["propSegmentRcv"] = 606] = "propSegmentRcv";
    BACnetPropertyType[BACnetPropertyType["propLocalAbortTx"] = 607] = "propLocalAbortTx";
    BACnetPropertyType[BACnetPropertyType["propReqRetriesTx"] = 608] = "propReqRetriesTx";
    BACnetPropertyType[BACnetPropertyType["propSegRetriesTx"] = 609] = "propSegRetriesTx";
    BACnetPropertyType[BACnetPropertyType["propDebounce"] = 610] = "propDebounce";
    BACnetPropertyType[BACnetPropertyType["propSampleTime"] = 611] = "propSampleTime";
    BACnetPropertyType[BACnetPropertyType["propNetMessagesRcv"] = 612] = "propNetMessagesRcv";
    BACnetPropertyType[BACnetPropertyType["propNetUnknownRoutes"] = 613] = "propNetUnknownRoutes";
    BACnetPropertyType[BACnetPropertyType["propNetRoutesBusy"] = 614] = "propNetRoutesBusy";
    BACnetPropertyType[BACnetPropertyType["propNetRejectsRcv"] = 615] = "propNetRejectsRcv";
    BACnetPropertyType[BACnetPropertyType["propNetUnknownMsgRcv"] = 616] = "propNetUnknownMsgRcv";
    BACnetPropertyType[BACnetPropertyType["propNetMessagesTx"] = 617] = "propNetMessagesTx";
    BACnetPropertyType[BACnetPropertyType["propLowBattery"] = 620] = "propLowBattery";
    BACnetPropertyType[BACnetPropertyType["propTransmitterId"] = 623] = "propTransmitterId";
    BACnetPropertyType[BACnetPropertyType["propPropertyCode"] = 624] = "propPropertyCode";
    BACnetPropertyType[BACnetPropertyType["propRxDataLifeErrors"] = 625] = "propRxDataLifeErrors";
    BACnetPropertyType[BACnetPropertyType["propWarningReference"] = 627] = "propWarningReference";
    BACnetPropertyType[BACnetPropertyType["propDelayTimer"] = 628] = "propDelayTimer";
    BACnetPropertyType[BACnetPropertyType["propReliabilityAction"] = 630] = "propReliabilityAction";
    BACnetPropertyType[BACnetPropertyType["propHighAlarmLimit"] = 631] = "propHighAlarmLimit";
    BACnetPropertyType[BACnetPropertyType["propLowAlarmLimit"] = 632] = "propLowAlarmLimit";
    BACnetPropertyType[BACnetPropertyType["propZoneTempOutput"] = 634] = "propZoneTempOutput";
    BACnetPropertyType[BACnetPropertyType["propHighWarningOffset"] = 635] = "propHighWarningOffset";
    BACnetPropertyType[BACnetPropertyType["propLowWarningOffset"] = 636] = "propLowWarningOffset";
    BACnetPropertyType[BACnetPropertyType["propDifferential"] = 637] = "propDifferential";
    BACnetPropertyType[BACnetPropertyType["propSetpointOutput"] = 638] = "propSetpointOutput";
    BACnetPropertyType[BACnetPropertyType["propSurrogateCacheMax"] = 639] = "propSurrogateCacheMax";
    BACnetPropertyType[BACnetPropertyType["propOccupiedOutput"] = 640] = "propOccupiedOutput";
    BACnetPropertyType[BACnetPropertyType["propSignalStrength"] = 641] = "propSignalStrength";
    BACnetPropertyType[BACnetPropertyType["propMissedTransmissions"] = 642] = "propMissedTransmissions";
    BACnetPropertyType[BACnetPropertyType["propParity"] = 643] = "propParity";
    BACnetPropertyType[BACnetPropertyType["propDataBits"] = 644] = "propDataBits";
    BACnetPropertyType[BACnetPropertyType["propNormalState"] = 646] = "propNormalState";
    BACnetPropertyType[BACnetPropertyType["propBatteryCondition"] = 647] = "propBatteryCondition";
    BACnetPropertyType[BACnetPropertyType["propCovRcvRate"] = 650] = "propCovRcvRate";
    BACnetPropertyType[BACnetPropertyType["propCovTxRate"] = 651] = "propCovTxRate";
    BACnetPropertyType[BACnetPropertyType["propMinOutValue"] = 652] = "propMinOutValue";
    BACnetPropertyType[BACnetPropertyType["propMaxOutValue"] = 653] = "propMaxOutValue";
    BACnetPropertyType[BACnetPropertyType["propAcknowledge"] = 656] = "propAcknowledge";
    BACnetPropertyType[BACnetPropertyType["propStopBits"] = 660] = "propStopBits";
    BACnetPropertyType[BACnetPropertyType["propDisplayPrecision"] = 661] = "propDisplayPrecision";
    BACnetPropertyType[BACnetPropertyType["propOutput"] = 663] = "propOutput";
    BACnetPropertyType[BACnetPropertyType["propTransmitsToday"] = 664] = "propTransmitsToday";
    BACnetPropertyType[BACnetPropertyType["propDeviceNumber"] = 665] = "propDeviceNumber";
    BACnetPropertyType[BACnetPropertyType["propEnabled"] = 673] = "propEnabled";
    BACnetPropertyType[BACnetPropertyType["propDeviceHealth"] = 675] = "propDeviceHealth";
    BACnetPropertyType[BACnetPropertyType["propDeviceConfiguredOk"] = 677] = "propDeviceConfiguredOk";
    BACnetPropertyType[BACnetPropertyType["propDeviceDatabaseOk"] = 678] = "propDeviceDatabaseOk";
    BACnetPropertyType[BACnetPropertyType["propDownloadTime"] = 679] = "propDownloadTime";
    BACnetPropertyType[BACnetPropertyType["propDownloadDate"] = 682] = "propDownloadDate";
    BACnetPropertyType[BACnetPropertyType["propPacketsToday"] = 686] = "propPacketsToday";
    BACnetPropertyType[BACnetPropertyType["propErrorsToday"] = 687] = "propErrorsToday";
    BACnetPropertyType[BACnetPropertyType["propRetriesToday"] = 688] = "propRetriesToday";
    BACnetPropertyType[BACnetPropertyType["propErrorPercent"] = 689] = "propErrorPercent";
    BACnetPropertyType[BACnetPropertyType["propProcessVariable"] = 695] = "propProcessVariable";
    BACnetPropertyType[BACnetPropertyType["propDirectActing"] = 697] = "propDirectActing";
    BACnetPropertyType[BACnetPropertyType["propPresentState"] = 698] = "propPresentState";
    BACnetPropertyType[BACnetPropertyType["propPresentIndex"] = 700] = "propPresentIndex";
    BACnetPropertyType[BACnetPropertyType["propProportionalTerm"] = 701] = "propProportionalTerm";
    BACnetPropertyType[BACnetPropertyType["propIntegralTerm"] = 702] = "propIntegralTerm";
    BACnetPropertyType[BACnetPropertyType["propDerivativeTerm"] = 703] = "propDerivativeTerm";
    BACnetPropertyType[BACnetPropertyType["propLowSaturationTime"] = 704] = "propLowSaturationTime";
    BACnetPropertyType[BACnetPropertyType["propHighSaturationTime"] = 705] = "propHighSaturationTime";
    BACnetPropertyType[BACnetPropertyType["propError"] = 706] = "propError";
    BACnetPropertyType[BACnetPropertyType["propActualPeriod"] = 707] = "propActualPeriod";
    BACnetPropertyType[BACnetPropertyType["propAlarmCount"] = 708] = "propAlarmCount";
    BACnetPropertyType[BACnetPropertyType["propAlarmFlags"] = 709] = "propAlarmFlags";
    BACnetPropertyType[BACnetPropertyType["propNumBo"] = 710] = "propNumBo";
    BACnetPropertyType[BACnetPropertyType["propNumAo"] = 711] = "propNumAo";
    BACnetPropertyType[BACnetPropertyType["propNumBi"] = 712] = "propNumBi";
    BACnetPropertyType[BACnetPropertyType["propNumAi"] = 713] = "propNumAi";
    BACnetPropertyType[BACnetPropertyType["propRemoteName"] = 714] = "propRemoteName";
    BACnetPropertyType[BACnetPropertyType["propDeleted_717"] = 717] = "propDeleted_717";
    BACnetPropertyType[BACnetPropertyType["propRemoteObjectType"] = 718] = "propRemoteObjectType";
    BACnetPropertyType[BACnetPropertyType["propRemoteObjectReference"] = 720] = "propRemoteObjectReference";
    BACnetPropertyType[BACnetPropertyType["propRestoreCommandPriority"] = 721] = "propRestoreCommandPriority";
    BACnetPropertyType[BACnetPropertyType["propAntiSpike"] = 722] = "propAntiSpike";
    BACnetPropertyType[BACnetPropertyType["propFilterOrder"] = 723] = "propFilterOrder";
    BACnetPropertyType[BACnetPropertyType["propSpikeWindow"] = 724] = "propSpikeWindow";
    BACnetPropertyType[BACnetPropertyType["propSpikeFraction"] = 725] = "propSpikeFraction";
    BACnetPropertyType[BACnetPropertyType["propStartupValue"] = 728] = "propStartupValue";
    BACnetPropertyType[BACnetPropertyType["propSignPriDbSize"] = 730] = "propSignPriDbSize";
    BACnetPropertyType[BACnetPropertyType["propSignPriUsed"] = 731] = "propSignPriUsed";
    BACnetPropertyType[BACnetPropertyType["propSignPriPeak"] = 732] = "propSignPriPeak";
    BACnetPropertyType[BACnetPropertyType["propTimerDbSize"] = 733] = "propTimerDbSize";
    BACnetPropertyType[BACnetPropertyType["propTimerUsed"] = 734] = "propTimerUsed";
    BACnetPropertyType[BACnetPropertyType["propTimerPeak"] = 735] = "propTimerPeak";
    BACnetPropertyType[BACnetPropertyType["propMethodToTrack"] = 736] = "propMethodToTrack";
    BACnetPropertyType[BACnetPropertyType["propObjectToTrack"] = 737] = "propObjectToTrack";
    BACnetPropertyType[BACnetPropertyType["propPeakMethodTime"] = 738] = "propPeakMethodTime";
    BACnetPropertyType[BACnetPropertyType["propLastMethodTime"] = 739] = "propLastMethodTime";
    BACnetPropertyType[BACnetPropertyType["propEnableDiagnostic"] = 740] = "propEnableDiagnostic";
    BACnetPropertyType[BACnetPropertyType["propTaskExecTime"] = 741] = "propTaskExecTime";
    BACnetPropertyType[BACnetPropertyType["propErrorLog"] = 742] = "propErrorLog";
    BACnetPropertyType[BACnetPropertyType["propMethodToStopTrack"] = 743] = "propMethodToStopTrack";
    BACnetPropertyType[BACnetPropertyType["propObjectToStopTrack"] = 744] = "propObjectToStopTrack";
    BACnetPropertyType[BACnetPropertyType["propBacnetBroadcastReceiveRate"] = 745] = "propBacnetBroadcastReceiveRate";
    BACnetPropertyType[BACnetPropertyType["propDirection"] = 746] = "propDirection";
    BACnetPropertyType[BACnetPropertyType["propPeerReference"] = 748] = "propPeerReference";
    BACnetPropertyType[BACnetPropertyType["propHostName"] = 750] = "propHostName";
    BACnetPropertyType[BACnetPropertyType["propSource"] = 751] = "propSource";
    BACnetPropertyType[BACnetPropertyType["propDestination"] = 752] = "propDestination";
    BACnetPropertyType[BACnetPropertyType["propFeedbackReference"] = 753] = "propFeedbackReference";
    BACnetPropertyType[BACnetPropertyType["propValueBeforeReset"] = 754] = "propValueBeforeReset";
    BACnetPropertyType[BACnetPropertyType["propIeiejFunctionAList"] = 755] = "propIeiejFunctionAList";
    BACnetPropertyType[BACnetPropertyType["propIeiejFunctionAPeriod"] = 756] = "propIeiejFunctionAPeriod";
    BACnetPropertyType[BACnetPropertyType["propDeviceDiscoveryRange"] = 757] = "propDeviceDiscoveryRange";
    BACnetPropertyType[BACnetPropertyType["propOnlinePointDelay"] = 758] = "propOnlinePointDelay";
    BACnetPropertyType[BACnetPropertyType["propResyncPeriod"] = 759] = "propResyncPeriod";
    BACnetPropertyType[BACnetPropertyType["propSiteDirectorOnline"] = 760] = "propSiteDirectorOnline";
    BACnetPropertyType[BACnetPropertyType["propCommandList"] = 761] = "propCommandList";
    BACnetPropertyType[BACnetPropertyType["propPrestartHeatingCommand"] = 766] = "propPrestartHeatingCommand";
    BACnetPropertyType[BACnetPropertyType["propHasUnboundReferences"] = 767] = "propHasUnboundReferences";
    BACnetPropertyType[BACnetPropertyType["propPrestopCommand"] = 768] = "propPrestopCommand";
    BACnetPropertyType[BACnetPropertyType["propNameList"] = 769] = "propNameList";
    BACnetPropertyType[BACnetPropertyType["propDefaultForMetasys"] = 770] = "propDefaultForMetasys";
    BACnetPropertyType[BACnetPropertyType["propZomStatesText"] = 771] = "propZomStatesText";
    BACnetPropertyType[BACnetPropertyType["propZwcStatesText"] = 772] = "propZwcStatesText";
    BACnetPropertyType[BACnetPropertyType["propZomNbrStates"] = 773] = "propZomNbrStates";
    BACnetPropertyType[BACnetPropertyType["propZwcNbrStates"] = 774] = "propZwcNbrStates";
    BACnetPropertyType[BACnetPropertyType["propRampPeriod"] = 777] = "propRampPeriod";
    BACnetPropertyType[BACnetPropertyType["propWarmupCommand"] = 779] = "propWarmupCommand";
    BACnetPropertyType[BACnetPropertyType["propFeedback"] = 782] = "propFeedback";
    BACnetPropertyType[BACnetPropertyType["propSignatureInclude"] = 783] = "propSignatureInclude";
    BACnetPropertyType[BACnetPropertyType["propSignatureExclude"] = 784] = "propSignatureExclude";
    BACnetPropertyType[BACnetPropertyType["propAnnotationInclude"] = 785] = "propAnnotationInclude";
    BACnetPropertyType[BACnetPropertyType["propInternalOid"] = 786] = "propInternalOid";
    BACnetPropertyType[BACnetPropertyType["propNextAvailableOid"] = 787] = "propNextAvailableOid";
    BACnetPropertyType[BACnetPropertyType["propIsContainer"] = 788] = "propIsContainer";
    BACnetPropertyType[BACnetPropertyType["propInternal"] = 789] = "propInternal";
    BACnetPropertyType[BACnetPropertyType["propExecuting"] = 790] = "propExecuting";
    BACnetPropertyType[BACnetPropertyType["propAnnotationExclude"] = 791] = "propAnnotationExclude";
    BACnetPropertyType[BACnetPropertyType["propActionTable_1"] = 793] = "propActionTable_1";
    BACnetPropertyType[BACnetPropertyType["propActionTable_2"] = 794] = "propActionTable_2";
    BACnetPropertyType[BACnetPropertyType["propCarbonDioxide"] = 795] = "propCarbonDioxide";
    BACnetPropertyType[BACnetPropertyType["propObjectOrder"] = 796] = "propObjectOrder";
    BACnetPropertyType[BACnetPropertyType["propJciObjectType"] = 797] = "propJciObjectType";
    BACnetPropertyType[BACnetPropertyType["propScaleFactor"] = 799] = "propScaleFactor";
    BACnetPropertyType[BACnetPropertyType["propTreeRevision"] = 803] = "propTreeRevision";
    BACnetPropertyType[BACnetPropertyType["propNetN2Address"] = 806] = "propNetN2Address";
    BACnetPropertyType[BACnetPropertyType["propNetPointType"] = 807] = "propNetPointType";
    BACnetPropertyType[BACnetPropertyType["propNetPointAddr"] = 808] = "propNetPointAddr";
    BACnetPropertyType[BACnetPropertyType["propOverridden"] = 809] = "propOverridden";
    BACnetPropertyType[BACnetPropertyType["propTrouble"] = 810] = "propTrouble";
    BACnetPropertyType[BACnetPropertyType["propDefault"] = 813] = "propDefault";
    BACnetPropertyType[BACnetPropertyType["propAllItemsUpdateInProgress"] = 814] = "propAllItemsUpdateInProgress";
    BACnetPropertyType[BACnetPropertyType["propRepositoryStatus"] = 815] = "propRepositoryStatus";
    BACnetPropertyType[BACnetPropertyType["propSamplesLost"] = 816] = "propSamplesLost";
    BACnetPropertyType[BACnetPropertyType["propConsumption"] = 818] = "propConsumption";
    BACnetPropertyType[BACnetPropertyType["propRateUnits"] = 819] = "propRateUnits";
    BACnetPropertyType[BACnetPropertyType["propConsumptionUnits"] = 820] = "propConsumptionUnits";
    BACnetPropertyType[BACnetPropertyType["propCounterObject"] = 821] = "propCounterObject";
    BACnetPropertyType[BACnetPropertyType["propRateConstant"] = 822] = "propRateConstant";
    BACnetPropertyType[BACnetPropertyType["propRolloverLimit"] = 823] = "propRolloverLimit";
    BACnetPropertyType[BACnetPropertyType["propSampleRate"] = 824] = "propSampleRate";
    BACnetPropertyType[BACnetPropertyType["propTimeBetweenBufferReads"] = 825] = "propTimeBetweenBufferReads";
    BACnetPropertyType[BACnetPropertyType["propRateLimit"] = 826] = "propRateLimit";
    BACnetPropertyType[BACnetPropertyType["propRateDefault"] = 827] = "propRateDefault";
    BACnetPropertyType[BACnetPropertyType["propConsumpUnreliable"] = 828] = "propConsumpUnreliable";
    BACnetPropertyType[BACnetPropertyType["propTransferBufferFull"] = 829] = "propTransferBufferFull";
    BACnetPropertyType[BACnetPropertyType["propPulseConsumption"] = 830] = "propPulseConsumption";
    BACnetPropertyType[BACnetPropertyType["propPreviousConsumption"] = 831] = "propPreviousConsumption";
    BACnetPropertyType[BACnetPropertyType["propScheduleOccupiedCommand"] = 832] = "propScheduleOccupiedCommand";
    BACnetPropertyType[BACnetPropertyType["propScheduleUnoccupiedCommand"] = 836] = "propScheduleUnoccupiedCommand";
    BACnetPropertyType[BACnetPropertyType["propLoadedClasses"] = 838] = "propLoadedClasses";
    BACnetPropertyType[BACnetPropertyType["propCovCount"] = 839] = "propCovCount";
    BACnetPropertyType[BACnetPropertyType["propDateOfManufacture"] = 840] = "propDateOfManufacture";
    BACnetPropertyType[BACnetPropertyType["propPrestartCoolingCommand"] = 841] = "propPrestartCoolingCommand";
    BACnetPropertyType[BACnetPropertyType["propObjectCount"] = 844] = "propObjectCount";
    BACnetPropertyType[BACnetPropertyType["propInternodeCommTimer"] = 845] = "propInternodeCommTimer";
    BACnetPropertyType[BACnetPropertyType["propBacnetDeviceId"] = 846] = "propBacnetDeviceId";
    BACnetPropertyType[BACnetPropertyType["propJciSystemStatus"] = 847] = "propJciSystemStatus";
    BACnetPropertyType[BACnetPropertyType["propMaxMessageBuffer"] = 848] = "propMaxMessageBuffer";
    BACnetPropertyType[BACnetPropertyType["propArchiveDate"] = 849] = "propArchiveDate";
    BACnetPropertyType[BACnetPropertyType["propArchiveTime"] = 850] = "propArchiveTime";
    BACnetPropertyType[BACnetPropertyType["propPeakCovCount"] = 851] = "propPeakCovCount";
    BACnetPropertyType[BACnetPropertyType["propUseRemoteAlarming"] = 853] = "propUseRemoteAlarming";
    BACnetPropertyType[BACnetPropertyType["propEventRate"] = 854] = "propEventRate";
    BACnetPropertyType[BACnetPropertyType["propAuditRate"] = 855] = "propAuditRate";
    BACnetPropertyType[BACnetPropertyType["propPeakCovCacheCount"] = 856] = "propPeakCovCacheCount";
    BACnetPropertyType[BACnetPropertyType["propTransferBufferFullWorstNxe"] = 857] = "propTransferBufferFullWorstNxe";
    BACnetPropertyType[BACnetPropertyType["propAdsRepositoriesStatus"] = 858] = "propAdsRepositoriesStatus";
    BACnetPropertyType[BACnetPropertyType["propMaxObjectMemory"] = 860] = "propMaxObjectMemory";
    BACnetPropertyType[BACnetPropertyType["propTransferAllSamples"] = 861] = "propTransferAllSamples";
    BACnetPropertyType[BACnetPropertyType["propPollRate"] = 862] = "propPollRate";
    BACnetPropertyType[BACnetPropertyType["propFreeObjectMemory"] = 863] = "propFreeObjectMemory";
    BACnetPropertyType[BACnetPropertyType["propNetworkTolerance"] = 864] = "propNetworkTolerance";
    BACnetPropertyType[BACnetPropertyType["propDetectionInterval"] = 865] = "propDetectionInterval";
    BACnetPropertyType[BACnetPropertyType["propTransportFailureRate"] = 867] = "propTransportFailureRate";
    BACnetPropertyType[BACnetPropertyType["propMaximumIntermittentFailureP"] = 868] = "propMaximumIntermittentFailureP";
    BACnetPropertyType[BACnetPropertyType["propAverageIntermittentFailureP"] = 869] = "propAverageIntermittentFailureP";
    BACnetPropertyType[BACnetPropertyType["propPowerFrequency"] = 872] = "propPowerFrequency";
    BACnetPropertyType[BACnetPropertyType["propConfiguredNetworkNumber"] = 875] = "propConfiguredNetworkNumber";
    BACnetPropertyType[BACnetPropertyType["propDeviceAddress"] = 876] = "propDeviceAddress";
    BACnetPropertyType[BACnetPropertyType["propCooldownCommand"] = 879] = "propCooldownCommand";
    BACnetPropertyType[BACnetPropertyType["propExpectedMethodTime"] = 880] = "propExpectedMethodTime";
    BACnetPropertyType[BACnetPropertyType["propClassToTrack"] = 881] = "propClassToTrack";
    BACnetPropertyType[BACnetPropertyType["propClassMethodTimes"] = 882] = "propClassMethodTimes";
    BACnetPropertyType[BACnetPropertyType["propWorstCaseMethodTimes"] = 883] = "propWorstCaseMethodTimes";
    BACnetPropertyType[BACnetPropertyType["propFixedBootVersion"] = 884] = "propFixedBootVersion";
    BACnetPropertyType[BACnetPropertyType["propControl"] = 887] = "propControl";
    BACnetPropertyType[BACnetPropertyType["propDependents"] = 888] = "propDependents";
    BACnetPropertyType[BACnetPropertyType["propShutdownState"] = 889] = "propShutdownState";
    BACnetPropertyType[BACnetPropertyType["propStartupDelay"] = 890] = "propStartupDelay";
    BACnetPropertyType[BACnetPropertyType["propMaxEntries"] = 893] = "propMaxEntries";
    BACnetPropertyType[BACnetPropertyType["propDefaultAttrNumber"] = 894] = "propDefaultAttrNumber";
    BACnetPropertyType[BACnetPropertyType["propAlternateMaster"] = 895] = "propAlternateMaster";
    BACnetPropertyType[BACnetPropertyType["propUsedEntries"] = 896] = "propUsedEntries";
    BACnetPropertyType[BACnetPropertyType["propBasUnitSystem"] = 898] = "propBasUnitSystem";
    BACnetPropertyType[BACnetPropertyType["propInstanceSize"] = 900] = "propInstanceSize";
    BACnetPropertyType[BACnetPropertyType["propVersion"] = 901] = "propVersion";
    BACnetPropertyType[BACnetPropertyType["propFileName"] = 902] = "propFileName";
    BACnetPropertyType[BACnetPropertyType["propReferenceCount"] = 905] = "propReferenceCount";
    BACnetPropertyType[BACnetPropertyType["propDeviceName"] = 907] = "propDeviceName";
    BACnetPropertyType[BACnetPropertyType["propObjectCategory"] = 908] = "propObjectCategory";
    BACnetPropertyType[BACnetPropertyType["propSystemName"] = 910] = "propSystemName";
    BACnetPropertyType[BACnetPropertyType["propLowCutoffValue"] = 912] = "propLowCutoffValue";
    BACnetPropertyType[BACnetPropertyType["propOffline"] = 913] = "propOffline";
    BACnetPropertyType[BACnetPropertyType["propBacklightIntensity"] = 914] = "propBacklightIntensity";
    BACnetPropertyType[BACnetPropertyType["propBacklightTimeout"] = 915] = "propBacklightTimeout";
    BACnetPropertyType[BACnetPropertyType["propDisplayContrast"] = 916] = "propDisplayContrast";
    BACnetPropertyType[BACnetPropertyType["propIdlePageTimeout"] = 917] = "propIdlePageTimeout";
    BACnetPropertyType[BACnetPropertyType["propPasswordAuthLevel"] = 918] = "propPasswordAuthLevel";
    BACnetPropertyType[BACnetPropertyType["propBindRetryCount"] = 920] = "propBindRetryCount";
    BACnetPropertyType[BACnetPropertyType["propDestOid"] = 921] = "propDestOid";
    BACnetPropertyType[BACnetPropertyType["propBindStatus"] = 922] = "propBindStatus";
    BACnetPropertyType[BACnetPropertyType["propNextSurOid"] = 923] = "propNextSurOid";
    BACnetPropertyType[BACnetPropertyType["propNextSurDevOid"] = 930] = "propNextSurDevOid";
    BACnetPropertyType[BACnetPropertyType["propStatesText"] = 931] = "propStatesText";
    BACnetPropertyType[BACnetPropertyType["propTaskId"] = 932] = "propTaskId";
    BACnetPropertyType[BACnetPropertyType["propOstType"] = 933] = "propOstType";
    BACnetPropertyType[BACnetPropertyType["propAdaptationEnabled"] = 934] = "propAdaptationEnabled";
    BACnetPropertyType[BACnetPropertyType["propZoneOccModeObj"] = 935] = "propZoneOccModeObj";
    BACnetPropertyType[BACnetPropertyType["propZoneWcModeObj"] = 936] = "propZoneWcModeObj";
    BACnetPropertyType[BACnetPropertyType["propHeatingSetpoint"] = 937] = "propHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propHeatingStptStatus"] = 938] = "propHeatingStptStatus";
    BACnetPropertyType[BACnetPropertyType["propCoolingSetpoint"] = 939] = "propCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propCoolingStptStatus"] = 940] = "propCoolingStptStatus";
    BACnetPropertyType[BACnetPropertyType["propZoneTemperature"] = 941] = "propZoneTemperature";
    BACnetPropertyType[BACnetPropertyType["propZoneTempStatus"] = 942] = "propZoneTempStatus";
    BACnetPropertyType[BACnetPropertyType["propCoolingDesignTemp"] = 943] = "propCoolingDesignTemp";
    BACnetPropertyType[BACnetPropertyType["propHeatingDesignTemp"] = 944] = "propHeatingDesignTemp";
    BACnetPropertyType[BACnetPropertyType["propCoolingConstant"] = 945] = "propCoolingConstant";
    BACnetPropertyType[BACnetPropertyType["propHeatingConstant"] = 946] = "propHeatingConstant";
    BACnetPropertyType[BACnetPropertyType["propHeatingDeadtime"] = 947] = "propHeatingDeadtime";
    BACnetPropertyType[BACnetPropertyType["propCoolingDeadtime"] = 948] = "propCoolingDeadtime";
    BACnetPropertyType[BACnetPropertyType["propMinPrestartTime"] = 949] = "propMinPrestartTime";
    BACnetPropertyType[BACnetPropertyType["propScheduleOutputType"] = 950] = "propScheduleOutputType";
    BACnetPropertyType[BACnetPropertyType["propScheduleDataType"] = 951] = "propScheduleDataType";
    BACnetPropertyType[BACnetPropertyType["propMaxPrestartTime"] = 954] = "propMaxPrestartTime";
    BACnetPropertyType[BACnetPropertyType["propOffset"] = 956] = "propOffset";
    BACnetPropertyType[BACnetPropertyType["propMaxPrestopTime"] = 957] = "propMaxPrestopTime";
    BACnetPropertyType[BACnetPropertyType["propCalcPrestartTime"] = 958] = "propCalcPrestartTime";
    BACnetPropertyType[BACnetPropertyType["propCalcPrestopTime"] = 959] = "propCalcPrestopTime";
    BACnetPropertyType[BACnetPropertyType["propArea"] = 960] = "propArea";
    BACnetPropertyType[BACnetPropertyType["propMode"] = 961] = "propMode";
    BACnetPropertyType[BACnetPropertyType["propTempDifferential"] = 962] = "propTempDifferential";
    BACnetPropertyType[BACnetPropertyType["propZoneScheduleObj"] = 963] = "propZoneScheduleObj";
    BACnetPropertyType[BACnetPropertyType["propPerformIndex"] = 965] = "propPerformIndex";
    BACnetPropertyType[BACnetPropertyType["propPickupGain"] = 968] = "propPickupGain";
    BACnetPropertyType[BACnetPropertyType["propMinPulseWidth"] = 969] = "propMinPulseWidth";
    BACnetPropertyType[BACnetPropertyType["propZoneScheduleStatus"] = 971] = "propZoneScheduleStatus";
    BACnetPropertyType[BACnetPropertyType["propTemperatureUnits"] = 972] = "propTemperatureUnits";
    BACnetPropertyType[BACnetPropertyType["propNoiseEstimate"] = 977] = "propNoiseEstimate";
    BACnetPropertyType[BACnetPropertyType["propZoneTempAtStart"] = 984] = "propZoneTempAtStart";
    BACnetPropertyType[BACnetPropertyType["propStptReachedTime"] = 985] = "propStptReachedTime";
    BACnetPropertyType[BACnetPropertyType["propZoneOccTime"] = 986] = "propZoneOccTime";
    BACnetPropertyType[BACnetPropertyType["propZoneUnoccTime"] = 987] = "propZoneUnoccTime";
    BACnetPropertyType[BACnetPropertyType["propStandardTimeStart"] = 988] = "propStandardTimeStart";
    BACnetPropertyType[BACnetPropertyType["propTimeUntilEoi"] = 989] = "propTimeUntilEoi";
    BACnetPropertyType[BACnetPropertyType["propSlotA"] = 990] = "propSlotA";
    BACnetPropertyType[BACnetPropertyType["propSlotB"] = 991] = "propSlotB";
    BACnetPropertyType[BACnetPropertyType["propResyncAmount"] = 992] = "propResyncAmount";
    BACnetPropertyType[BACnetPropertyType["propCalculation"] = 993] = "propCalculation";
    BACnetPropertyType[BACnetPropertyType["propCurrentAmountShedByDl"] = 996] = "propCurrentAmountShedByDl";
    BACnetPropertyType[BACnetPropertyType["propCurrentProfile"] = 1000] = "propCurrentProfile";
    BACnetPropertyType[BACnetPropertyType["propPreviousProfile"] = 1001] = "propPreviousProfile";
    BACnetPropertyType[BACnetPropertyType["propMaxAllowedPeakUntilEoi"] = 1004] = "propMaxAllowedPeakUntilEoi";
    BACnetPropertyType[BACnetPropertyType["propSmoothedAbsError"] = 1005] = "propSmoothedAbsError";
    BACnetPropertyType[BACnetPropertyType["propAlarmState"] = 1006] = "propAlarmState";
    BACnetPropertyType[BACnetPropertyType["propShedIneligibility"] = 1007] = "propShedIneligibility";
    BACnetPropertyType[BACnetPropertyType["propReleaseRefusal"] = 1008] = "propReleaseRefusal";
    BACnetPropertyType[BACnetPropertyType["propReleasePending"] = 1009] = "propReleasePending";
    BACnetPropertyType[BACnetPropertyType["propCalcPrestartDate"] = 1011] = "propCalcPrestartDate";
    BACnetPropertyType[BACnetPropertyType["propCalcPrestopDate"] = 1012] = "propCalcPrestopDate";
    BACnetPropertyType[BACnetPropertyType["propAmountShed"] = 1013] = "propAmountShed";
    BACnetPropertyType[BACnetPropertyType["propLoadList"] = 1015] = "propLoadList";
    BACnetPropertyType[BACnetPropertyType["propMonitorModeRelease"] = 1016] = "propMonitorModeRelease";
    BACnetPropertyType[BACnetPropertyType["propStandardTimeOffset"] = 1017] = "propStandardTimeOffset";
    BACnetPropertyType[BACnetPropertyType["propCurrentAvailableEnergySavin"] = 1019] = "propCurrentAvailableEnergySavin";
    BACnetPropertyType[BACnetPropertyType["propCommandsPriority"] = 1020] = "propCommandsPriority";
    BACnetPropertyType[BACnetPropertyType["propQueueUsedCurr"] = 1022] = "propQueueUsedCurr";
    BACnetPropertyType[BACnetPropertyType["propQueueUsedMost"] = 1023] = "propQueueUsedMost";
    BACnetPropertyType[BACnetPropertyType["propMsgsOnQueueCurr"] = 1024] = "propMsgsOnQueueCurr";
    BACnetPropertyType[BACnetPropertyType["propComtestDest"] = 1036] = "propComtestDest";
    BACnetPropertyType[BACnetPropertyType["propLastExecutedDate"] = 1039] = "propLastExecutedDate";
    BACnetPropertyType[BACnetPropertyType["propDaylightSavingTimeStart"] = 1040] = "propDaylightSavingTimeStart";
    BACnetPropertyType[BACnetPropertyType["propLatitude"] = 1041] = "propLatitude";
    BACnetPropertyType[BACnetPropertyType["propLongitude"] = 1042] = "propLongitude";
    BACnetPropertyType[BACnetPropertyType["propAzimuth"] = 1043] = "propAzimuth";
    BACnetPropertyType[BACnetPropertyType["propLastExecutedTime"] = 1044] = "propLastExecutedTime";
    BACnetPropertyType[BACnetPropertyType["propSignupsToDevice"] = 1045] = "propSignupsToDevice";
    BACnetPropertyType[BACnetPropertyType["propSignPriFromDevice"] = 1046] = "propSignPriFromDevice";
    BACnetPropertyType[BACnetPropertyType["propUnboundReferences"] = 1047] = "propUnboundReferences";
    BACnetPropertyType[BACnetPropertyType["propDuplicateReferences"] = 1048] = "propDuplicateReferences";
    BACnetPropertyType[BACnetPropertyType["propNumberOfIHave"] = 1049] = "propNumberOfIHave";
    BACnetPropertyType[BACnetPropertyType["propListTotalElements"] = 1050] = "propListTotalElements";
    BACnetPropertyType[BACnetPropertyType["propListTotalSize"] = 1051] = "propListTotalSize";
    BACnetPropertyType[BACnetPropertyType["propLoads"] = 1053] = "propLoads";
    BACnetPropertyType[BACnetPropertyType["propMaster"] = 1059] = "propMaster";
    BACnetPropertyType[BACnetPropertyType["propAccumulatedDelay"] = 1060] = "propAccumulatedDelay";
    BACnetPropertyType[BACnetPropertyType["propSubordinatesList"] = 1061] = "propSubordinatesList";
    BACnetPropertyType[BACnetPropertyType["propInputList"] = 1062] = "propInputList";
    BACnetPropertyType[BACnetPropertyType["propAverageOutput"] = 1063] = "propAverageOutput";
    BACnetPropertyType[BACnetPropertyType["propHighOr"] = 1064] = "propHighOr";
    BACnetPropertyType[BACnetPropertyType["propLowAnd"] = 1065] = "propLowAnd";
    BACnetPropertyType[BACnetPropertyType["propStartupCodeVersion"] = 1066] = "propStartupCodeVersion";
    BACnetPropertyType[BACnetPropertyType["propLogic"] = 1070] = "propLogic";
    BACnetPropertyType[BACnetPropertyType["propSunrise"] = 1072] = "propSunrise";
    BACnetPropertyType[BACnetPropertyType["propSunset"] = 1078] = "propSunset";
    BACnetPropertyType[BACnetPropertyType["propDuration"] = 1080] = "propDuration";
    BACnetPropertyType[BACnetPropertyType["propTimeRemaining"] = 1081] = "propTimeRemaining";
    BACnetPropertyType[BACnetPropertyType["propReset"] = 1082] = "propReset";
    BACnetPropertyType[BACnetPropertyType["propResetAction"] = 1083] = "propResetAction";
    BACnetPropertyType[BACnetPropertyType["propSolarNoon"] = 1084] = "propSolarNoon";
    BACnetPropertyType[BACnetPropertyType["propUserNameIsBacnetObjName"] = 1092] = "propUserNameIsBacnetObjName";
    BACnetPropertyType[BACnetPropertyType["propDaylightSavingTimeOffset"] = 1093] = "propDaylightSavingTimeOffset";
    BACnetPropertyType[BACnetPropertyType["propSendNotificationsToSupervis"] = 1095] = "propSendNotificationsToSupervis";
    BACnetPropertyType[BACnetPropertyType["propGlobalCalendarReference"] = 1096] = "propGlobalCalendarReference";
    BACnetPropertyType[BACnetPropertyType["propGlobalCalendarUpdate"] = 1097] = "propGlobalCalendarUpdate";
    BACnetPropertyType[BACnetPropertyType["propDateListChanged"] = 1098] = "propDateListChanged";
    BACnetPropertyType[BACnetPropertyType["propStartupDiagnostics"] = 1100] = "propStartupDiagnostics";
    BACnetPropertyType[BACnetPropertyType["propEquationOfTime"] = 1101] = "propEquationOfTime";
    BACnetPropertyType[BACnetPropertyType["propSolarDeclination"] = 1102] = "propSolarDeclination";
    BACnetPropertyType[BACnetPropertyType["propUserSelectedStatesText"] = 1103] = "propUserSelectedStatesText";
    BACnetPropertyType[BACnetPropertyType["propLastTest"] = 1104] = "propLastTest";
    BACnetPropertyType[BACnetPropertyType["propOutputState"] = 1109] = "propOutputState";
    BACnetPropertyType[BACnetPropertyType["propLoadRating"] = 1110] = "propLoadRating";
    BACnetPropertyType[BACnetPropertyType["propOutputShedCommand"] = 1111] = "propOutputShedCommand";
    BACnetPropertyType[BACnetPropertyType["propLastShedTime"] = 1112] = "propLastShedTime";
    BACnetPropertyType[BACnetPropertyType["propLastRealShed"] = 1113] = "propLastRealShed";
    BACnetPropertyType[BACnetPropertyType["propStartTask"] = 1117] = "propStartTask";
    BACnetPropertyType[BACnetPropertyType["propLocalSetpoint"] = 1118] = "propLocalSetpoint";
    BACnetPropertyType[BACnetPropertyType["propPreLoginBannerText"] = 1122] = "propPreLoginBannerText";
    BACnetPropertyType[BACnetPropertyType["propPreLoginBannerTimeoutPerio"] = 1123] = "propPreLoginBannerTimeoutPerio";
    BACnetPropertyType[BACnetPropertyType["propCovCosCount"] = 1130] = "propCovCosCount";
    BACnetPropertyType[BACnetPropertyType["propEthernetMacAddress"] = 1134] = "propEthernetMacAddress";
    BACnetPropertyType[BACnetPropertyType["propIpMask"] = 1136] = "propIpMask";
    BACnetPropertyType[BACnetPropertyType["propIpRouterAddress"] = 1137] = "propIpRouterAddress";
    BACnetPropertyType[BACnetPropertyType["propDhcpEnabled"] = 1138] = "propDhcpEnabled";
    BACnetPropertyType[BACnetPropertyType["propAllocatedFreePoolSize"] = 1139] = "propAllocatedFreePoolSize";
    BACnetPropertyType[BACnetPropertyType["propResetTime"] = 1140] = "propResetTime";
    BACnetPropertyType[BACnetPropertyType["propResetDate"] = 1141] = "propResetDate";
    BACnetPropertyType[BACnetPropertyType["propMessageTransmits"] = 1142] = "propMessageTransmits";
    BACnetPropertyType[BACnetPropertyType["propMessageReceives"] = 1143] = "propMessageReceives";
    BACnetPropertyType[BACnetPropertyType["propBufferOverflows"] = 1144] = "propBufferOverflows";
    BACnetPropertyType[BACnetPropertyType["propHardwareOverflows"] = 1145] = "propHardwareOverflows";
    BACnetPropertyType[BACnetPropertyType["propFramingErrors"] = 1146] = "propFramingErrors";
    BACnetPropertyType[BACnetPropertyType["propParityErrors"] = 1147] = "propParityErrors";
    BACnetPropertyType[BACnetPropertyType["propChecksumErrors"] = 1148] = "propChecksumErrors";
    BACnetPropertyType[BACnetPropertyType["propNakErrors"] = 1149] = "propNakErrors";
    BACnetPropertyType[BACnetPropertyType["propOnlinePolls"] = 1150] = "propOnlinePolls";
    BACnetPropertyType[BACnetPropertyType["propOfflinePolls"] = 1151] = "propOfflinePolls";
    BACnetPropertyType[BACnetPropertyType["propOfflineOccurrences"] = 1153] = "propOfflineOccurrences";
    BACnetPropertyType[BACnetPropertyType["propBaudRate"] = 1157] = "propBaudRate";
    BACnetPropertyType[BACnetPropertyType["propCheckCommandOnMismatch"] = 1158] = "propCheckCommandOnMismatch";
    BACnetPropertyType[BACnetPropertyType["propAlarm"] = 1159] = "propAlarm";
    BACnetPropertyType[BACnetPropertyType["propCovThreshold"] = 1161] = "propCovThreshold";
    BACnetPropertyType[BACnetPropertyType["propRetries"] = 1162] = "propRetries";
    BACnetPropertyType[BACnetPropertyType["propPollDelay"] = 1163] = "propPollDelay";
    BACnetPropertyType[BACnetPropertyType["propMessageTimeout"] = 1165] = "propMessageTimeout";
    BACnetPropertyType[BACnetPropertyType["propRetryAttempts"] = 1167] = "propRetryAttempts";
    BACnetPropertyType[BACnetPropertyType["propDatalinkType"] = 1168] = "propDatalinkType";
    BACnetPropertyType[BACnetPropertyType["propAcquiredFreePoolSize"] = 1169] = "propAcquiredFreePoolSize";
    BACnetPropertyType[BACnetPropertyType["propPointType"] = 1173] = "propPointType";
    BACnetPropertyType[BACnetPropertyType["propRateUnreliable"] = 1174] = "propRateUnreliable";
    BACnetPropertyType[BACnetPropertyType["propSnmpRequestPort"] = 1180] = "propSnmpRequestPort";
    BACnetPropertyType[BACnetPropertyType["propPageSize"] = 1181] = "propPageSize";
    BACnetPropertyType[BACnetPropertyType["propTimeRemainingUpdateInterval"] = 1184] = "propTimeRemainingUpdateInterval";
    BACnetPropertyType[BACnetPropertyType["propStartupOffStateAutoRelease"] = 1186] = "propStartupOffStateAutoRelease";
    BACnetPropertyType[BACnetPropertyType["propArchiveStatus"] = 1187] = "propArchiveStatus";
    BACnetPropertyType[BACnetPropertyType["propRetryInterval"] = 1195] = "propRetryInterval";
    BACnetPropertyType[BACnetPropertyType["propProportionalBand"] = 1200] = "propProportionalBand";
    BACnetPropertyType[BACnetPropertyType["propIntegralTime"] = 1201] = "propIntegralTime";
    BACnetPropertyType[BACnetPropertyType["propDerivativeTime"] = 1202] = "propDerivativeTime";
    BACnetPropertyType[BACnetPropertyType["propAllocatedSize"] = 1210] = "propAllocatedSize";
    BACnetPropertyType[BACnetPropertyType["propAllocatedLow"] = 1212] = "propAllocatedLow";
    BACnetPropertyType[BACnetPropertyType["propAcquiredSize"] = 1213] = "propAcquiredSize";
    BACnetPropertyType[BACnetPropertyType["propAcquiredAvailable"] = 1214] = "propAcquiredAvailable";
    BACnetPropertyType[BACnetPropertyType["propAcquiredLow"] = 1215] = "propAcquiredLow";
    BACnetPropertyType[BACnetPropertyType["propTransmitsPerMinute"] = 1217] = "propTransmitsPerMinute";
    BACnetPropertyType[BACnetPropertyType["propPointScanTime"] = 1218] = "propPointScanTime";
    BACnetPropertyType[BACnetPropertyType["propPollScanTime"] = 1219] = "propPollScanTime";
    BACnetPropertyType[BACnetPropertyType["propTimerMessageCount"] = 1221] = "propTimerMessageCount";
    BACnetPropertyType[BACnetPropertyType["propOtherMessageCount"] = 1222] = "propOtherMessageCount";
    BACnetPropertyType[BACnetPropertyType["propBacnetUdpPort"] = 1223] = "propBacnetUdpPort";
    BACnetPropertyType[BACnetPropertyType["propStartupOffStateCommandPrio"] = 1224] = "propStartupOffStateCommandPrio";
    BACnetPropertyType[BACnetPropertyType["propNotEligible"] = 1228] = "propNotEligible";
    BACnetPropertyType[BACnetPropertyType["propStartupOffStateEnable"] = 1229] = "propStartupOffStateEnable";
    BACnetPropertyType[BACnetPropertyType["propShedSent"] = 1231] = "propShedSent";
    BACnetPropertyType[BACnetPropertyType["propShedAccepted"] = 1232] = "propShedAccepted";
    BACnetPropertyType[BACnetPropertyType["propShedRefused"] = 1233] = "propShedRefused";
    BACnetPropertyType[BACnetPropertyType["propShedPending"] = 1234] = "propShedPending";
    BACnetPropertyType[BACnetPropertyType["propShedLost"] = 1235] = "propShedLost";
    BACnetPropertyType[BACnetPropertyType["propShedNotSent"] = 1236] = "propShedNotSent";
    BACnetPropertyType[BACnetPropertyType["propFaultStatusDisplay"] = 1238] = "propFaultStatusDisplay";
    BACnetPropertyType[BACnetPropertyType["propConnectedStatus"] = 1243] = "propConnectedStatus";
    BACnetPropertyType[BACnetPropertyType["propConnectionType"] = 1244] = "propConnectionType";
    BACnetPropertyType[BACnetPropertyType["propAttributeProperties"] = 1248] = "propAttributeProperties";
    BACnetPropertyType[BACnetPropertyType["propSurrogateDestOid"] = 1253] = "propSurrogateDestOid";
    BACnetPropertyType[BACnetPropertyType["propLowLoad"] = 1254] = "propLowLoad";
    BACnetPropertyType[BACnetPropertyType["propSequenceRow"] = 1255] = "propSequenceRow";
    BACnetPropertyType[BACnetPropertyType["propWaitingForCommandedFlow"] = 1256] = "propWaitingForCommandedFlow";
    BACnetPropertyType[BACnetPropertyType["propTimeUntilDeviceOn"] = 1257] = "propTimeUntilDeviceOn";
    BACnetPropertyType[BACnetPropertyType["propSurrogateError"] = 1259] = "propSurrogateError";
    BACnetPropertyType[BACnetPropertyType["propMeterActive"] = 1260] = "propMeterActive";
    BACnetPropertyType[BACnetPropertyType["propSurrogateDeviceId"] = 1261] = "propSurrogateDeviceId";
    BACnetPropertyType[BACnetPropertyType["propDiscoverAllAsGeneralBacnet"] = 1264] = "propDiscoverAllAsGeneralBacnet";
    BACnetPropertyType[BACnetPropertyType["propBytesIn"] = 1271] = "propBytesIn";
    BACnetPropertyType[BACnetPropertyType["propBytesOut"] = 1272] = "propBytesOut";
    BACnetPropertyType[BACnetPropertyType["propErrorsIn"] = 1273] = "propErrorsIn";
    BACnetPropertyType[BACnetPropertyType["propErrorsOut"] = 1274] = "propErrorsOut";
    BACnetPropertyType[BACnetPropertyType["propLastKnownTimestamps"] = 1290] = "propLastKnownTimestamps";
    BACnetPropertyType[BACnetPropertyType["propBacnetOidAllocated"] = 1291] = "propBacnetOidAllocated";
    BACnetPropertyType[BACnetPropertyType["propBacnetOidUsed"] = 1292] = "propBacnetOidUsed";
    BACnetPropertyType[BACnetPropertyType["propInputRangeLow"] = 1293] = "propInputRangeLow";
    BACnetPropertyType[BACnetPropertyType["propInputRangeHigh"] = 1294] = "propInputRangeHigh";
    BACnetPropertyType[BACnetPropertyType["propOutputRangeLow"] = 1295] = "propOutputRangeLow";
    BACnetPropertyType[BACnetPropertyType["propOutputRangeHigh"] = 1296] = "propOutputRangeHigh";
    BACnetPropertyType[BACnetPropertyType["propAuditLog"] = 1300] = "propAuditLog";
    BACnetPropertyType[BACnetPropertyType["propWasPresent"] = 1302] = "propWasPresent";
    BACnetPropertyType[BACnetPropertyType["prop_1303"] = 1303] = "prop_1303";
    BACnetPropertyType[BACnetPropertyType["propActuatorFeedback"] = 1305] = "propActuatorFeedback";
    BACnetPropertyType[BACnetPropertyType["propSendOk"] = 1307] = "propSendOk";
    BACnetPropertyType[BACnetPropertyType["propDynamicDeadband"] = 1310] = "propDynamicDeadband";
    BACnetPropertyType[BACnetPropertyType["propPcode"] = 1320] = "propPcode";
    BACnetPropertyType[BACnetPropertyType["propAllocatedLargest"] = 1333] = "propAllocatedLargest";
    BACnetPropertyType[BACnetPropertyType["propAcquiredLargest"] = 1334] = "propAcquiredLargest";
    BACnetPropertyType[BACnetPropertyType["propOverloadThreshold"] = 1338] = "propOverloadThreshold";
    BACnetPropertyType[BACnetPropertyType["propLiftCov"] = 1344] = "propLiftCov";
    BACnetPropertyType[BACnetPropertyType["propMaxChwFlow"] = 1345] = "propMaxChwFlow";
    BACnetPropertyType[BACnetPropertyType["propTowerPiping"] = 1348] = "propTowerPiping";
    BACnetPropertyType[BACnetPropertyType["propNoolctcEnable"] = 1349] = "propNoolctcEnable";
    BACnetPropertyType[BACnetPropertyType["propChillerRatedPower"] = 1350] = "propChillerRatedPower";
    BACnetPropertyType[BACnetPropertyType["propTowerRatedPower"] = 1351] = "propTowerRatedPower";
    BACnetPropertyType[BACnetPropertyType["propTowerDesignRange"] = 1352] = "propTowerDesignRange";
    BACnetPropertyType[BACnetPropertyType["propTowerDesignApproach"] = 1353] = "propTowerDesignApproach";
    BACnetPropertyType[BACnetPropertyType["propChillerplantSensitivity"] = 1354] = "propChillerplantSensitivity";
    BACnetPropertyType[BACnetPropertyType["propChillerplantLoad"] = 1355] = "propChillerplantLoad";
    BACnetPropertyType[BACnetPropertyType["propChillerplantCapacity"] = 1356] = "propChillerplantCapacity";
    BACnetPropertyType[BACnetPropertyType["propControllerType"] = 1357] = "propControllerType";
    BACnetPropertyType[BACnetPropertyType["propEwma"] = 1367] = "propEwma";
    BACnetPropertyType[BACnetPropertyType["propAbsoluteEwma"] = 1368] = "propAbsoluteEwma";
    BACnetPropertyType[BACnetPropertyType["propDatalink"] = 1370] = "propDatalink";
    BACnetPropertyType[BACnetPropertyType["propAlarmEventState"] = 1374] = "propAlarmEventState";
    BACnetPropertyType[BACnetPropertyType["propConnectedTo"] = 1376] = "propConnectedTo";
    BACnetPropertyType[BACnetPropertyType["propNodeNumber"] = 1378] = "propNodeNumber";
    BACnetPropertyType[BACnetPropertyType["propSaturationTime"] = 1381] = "propSaturationTime";
    BACnetPropertyType[BACnetPropertyType["propSpeedSetpoint"] = 1382] = "propSpeedSetpoint";
    BACnetPropertyType[BACnetPropertyType["propOutputFrequency"] = 1383] = "propOutputFrequency";
    BACnetPropertyType[BACnetPropertyType["propMotorSpeed"] = 1384] = "propMotorSpeed";
    BACnetPropertyType[BACnetPropertyType["propKilowattHours"] = 1385] = "propKilowattHours";
    BACnetPropertyType[BACnetPropertyType["propFaultCode"] = 1388] = "propFaultCode";
    BACnetPropertyType[BACnetPropertyType["propDriveRunning"] = 1389] = "propDriveRunning";
    BACnetPropertyType[BACnetPropertyType["propReferenceCommand"] = 1390] = "propReferenceCommand";
    BACnetPropertyType[BACnetPropertyType["propDriveCommand"] = 1391] = "propDriveCommand";
    BACnetPropertyType[BACnetPropertyType["propResetDriveFault"] = 1392] = "propResetDriveFault";
    BACnetPropertyType[BACnetPropertyType["propBypassDrive"] = 1393] = "propBypassDrive";
    BACnetPropertyType[BACnetPropertyType["propDisableAutomaticAlarming"] = 1396] = "propDisableAutomaticAlarming";
    BACnetPropertyType[BACnetPropertyType["propPercentCmd"] = 1397] = "propPercentCmd";
    BACnetPropertyType[BACnetPropertyType["propCapacityLimitSetup"] = 1398] = "propCapacityLimitSetup";
    BACnetPropertyType[BACnetPropertyType["propDatalinkOid"] = 1401] = "propDatalinkOid";
    BACnetPropertyType[BACnetPropertyType["propTimeZone"] = 1403] = "propTimeZone";
    BACnetPropertyType[BACnetPropertyType["propLocalTimeZone"] = 1404] = "propLocalTimeZone";
    BACnetPropertyType[BACnetPropertyType["propDstStartDate"] = 1409] = "propDstStartDate";
    BACnetPropertyType[BACnetPropertyType["propDstStartTime"] = 1410] = "propDstStartTime";
    BACnetPropertyType[BACnetPropertyType["propDstEndDate"] = 1411] = "propDstEndDate";
    BACnetPropertyType[BACnetPropertyType["propDstEndTime"] = 1412] = "propDstEndTime";
    BACnetPropertyType[BACnetPropertyType["propCategoryPermissions"] = 1413] = "propCategoryPermissions";
    BACnetPropertyType[BACnetPropertyType["propAttributePermissions"] = 1414] = "propAttributePermissions";
    BACnetPropertyType[BACnetPropertyType["propCommandPermissions"] = 1415] = "propCommandPermissions";
    BACnetPropertyType[BACnetPropertyType["propCreatePermissions"] = 1416] = "propCreatePermissions";
    BACnetPropertyType[BACnetPropertyType["propCoolingSetpointReference"] = 1417] = "propCoolingSetpointReference";
    BACnetPropertyType[BACnetPropertyType["propHeatingSetpointReference"] = 1418] = "propHeatingSetpointReference";
    BACnetPropertyType[BACnetPropertyType["propOccupancyReference"] = 1419] = "propOccupancyReference";
    BACnetPropertyType[BACnetPropertyType["propUnoccupiedState"] = 1420] = "propUnoccupiedState";
    BACnetPropertyType[BACnetPropertyType["propUnoccupiedStateSet"] = 1421] = "propUnoccupiedStateSet";
    BACnetPropertyType[BACnetPropertyType["propRemoteValue"] = 1427] = "propRemoteValue";
    BACnetPropertyType[BACnetPropertyType["propHardwareValue"] = 1433] = "propHardwareValue";
    BACnetPropertyType[BACnetPropertyType["propHighWarningLimit"] = 1447] = "propHighWarningLimit";
    BACnetPropertyType[BACnetPropertyType["propLowWarningLimit"] = 1448] = "propLowWarningLimit";
    BACnetPropertyType[BACnetPropertyType["propEventsLost"] = 1479] = "propEventsLost";
    BACnetPropertyType[BACnetPropertyType["propOutgoingEventRate"] = 1480] = "propOutgoingEventRate";
    BACnetPropertyType[BACnetPropertyType["propIncomingEventRate"] = 1481] = "propIncomingEventRate";
    BACnetPropertyType[BACnetPropertyType["propActionByName"] = 1486] = "propActionByName";
    BACnetPropertyType[BACnetPropertyType["propOutputDisplayPrecision"] = 1487] = "propOutputDisplayPrecision";
    BACnetPropertyType[BACnetPropertyType["propControlledVarDisplayPrecisi"] = 1488] = "propControlledVarDisplayPrecisi";
    BACnetPropertyType[BACnetPropertyType["propShedLevelType"] = 1489] = "propShedLevelType";
    BACnetPropertyType[BACnetPropertyType["propRequestedShedLevelValue"] = 1490] = "propRequestedShedLevelValue";
    BACnetPropertyType[BACnetPropertyType["propExpectedShedLevelValue"] = 1491] = "propExpectedShedLevelValue";
    BACnetPropertyType[BACnetPropertyType["propActualShedLevelValue"] = 1492] = "propActualShedLevelValue";
    BACnetPropertyType[BACnetPropertyType["propUnusedClasses"] = 1510] = "propUnusedClasses";
    BACnetPropertyType[BACnetPropertyType["propIsBound"] = 1511] = "propIsBound";
    BACnetPropertyType[BACnetPropertyType["propFindInternalOid"] = 1512] = "propFindInternalOid";
    BACnetPropertyType[BACnetPropertyType["propFoundObjectId"] = 1513] = "propFoundObjectId";
    BACnetPropertyType[BACnetPropertyType["propFoundReference"] = 1514] = "propFoundReference";
    BACnetPropertyType[BACnetPropertyType["propOutputList"] = 1515] = "propOutputList";
    BACnetPropertyType[BACnetPropertyType["propCustomerGuid"] = 1516] = "propCustomerGuid";
    BACnetPropertyType[BACnetPropertyType["propPlantGuid"] = 1517] = "propPlantGuid";
    BACnetPropertyType[BACnetPropertyType["propOnlineArchiveTransferInPro"] = 1528] = "propOnlineArchiveTransferInPro";
    BACnetPropertyType[BACnetPropertyType["propCommandCount"] = 1545] = "propCommandCount";
    BACnetPropertyType[BACnetPropertyType["propUnitType"] = 1579] = "propUnitType";
    BACnetPropertyType[BACnetPropertyType["propReturnAirTemp"] = 1605] = "propReturnAirTemp";
    BACnetPropertyType[BACnetPropertyType["propFanType"] = 1624] = "propFanType";
    BACnetPropertyType[BACnetPropertyType["propTargetRampDownEnabled"] = 1660] = "propTargetRampDownEnabled";
    BACnetPropertyType[BACnetPropertyType["propMinutesSinceMeterFailure"] = 1661] = "propMinutesSinceMeterFailure";
    BACnetPropertyType[BACnetPropertyType["propPreviousDemandLimit"] = 1662] = "propPreviousDemandLimit";
    BACnetPropertyType[BACnetPropertyType["propActiveDemandLimit"] = 1663] = "propActiveDemandLimit";
    BACnetPropertyType[BACnetPropertyType["propDemandLimitRampDownIterati"] = 1664] = "propDemandLimitRampDownIterati";
    BACnetPropertyType[BACnetPropertyType["propDemandLimitRampDownInterva"] = 1665] = "propDemandLimitRampDownInterva";
    BACnetPropertyType[BACnetPropertyType["propRampDownInProgress"] = 1666] = "propRampDownInProgress";
    BACnetPropertyType[BACnetPropertyType["propSequenceTable"] = 1668] = "propSequenceTable";
    BACnetPropertyType[BACnetPropertyType["propVersionString"] = 1686] = "propVersionString";
    BACnetPropertyType[BACnetPropertyType["propHandleStatus"] = 1689] = "propHandleStatus";
    BACnetPropertyType[BACnetPropertyType["propInstanceAttributePermissions"] = 1725] = "propInstanceAttributePermissions";
    BACnetPropertyType[BACnetPropertyType["propTodaysEarliestStartTime"] = 1726] = "propTodaysEarliestStartTime";
    BACnetPropertyType[BACnetPropertyType["propTodaysLatestStopTime"] = 1727] = "propTodaysLatestStopTime";
    BACnetPropertyType[BACnetPropertyType["propScheduleStartTimeValue"] = 1728] = "propScheduleStartTimeValue";
    BACnetPropertyType[BACnetPropertyType["propScheduleStopTimeValue"] = 1729] = "propScheduleStopTimeValue";
    BACnetPropertyType[BACnetPropertyType["propWarningBanner"] = 1730] = "propWarningBanner";
    BACnetPropertyType[BACnetPropertyType["propJciNetworkPortType"] = 1848] = "propJciNetworkPortType";
    BACnetPropertyType[BACnetPropertyType["propJciNetworkPortApduSegment"] = 1849] = "propJciNetworkPortApduSegment";
    BACnetPropertyType[BACnetPropertyType["propJciNetworkPortApduTimeout"] = 1850] = "propJciNetworkPortApduTimeout";
    BACnetPropertyType[BACnetPropertyType["propJciNetworkPortApduRetries"] = 1851] = "propJciNetworkPortApduRetries";
    BACnetPropertyType[BACnetPropertyType["propJciNetworkPortChangesPendi"] = 1852] = "propJciNetworkPortChangesPendi";
    BACnetPropertyType[BACnetPropertyType["propPreviousState"] = 2003] = "propPreviousState";
    BACnetPropertyType[BACnetPropertyType["propBreakLimit"] = 2006] = "propBreakLimit";
    BACnetPropertyType[BACnetPropertyType["propDeviceStatus"] = 2008] = "propDeviceStatus";
    BACnetPropertyType[BACnetPropertyType["propInterstageOnDelay"] = 2010] = "propInterstageOnDelay";
    BACnetPropertyType[BACnetPropertyType["propMakeLimit"] = 2012] = "propMakeLimit";
    BACnetPropertyType[BACnetPropertyType["propSysRamResource"] = 2016] = "propSysRamResource";
    BACnetPropertyType[BACnetPropertyType["propObjengQueResource"] = 2017] = "propObjengQueResource";
    BACnetPropertyType[BACnetPropertyType["propCpuUseResource"] = 2018] = "propCpuUseResource";
    BACnetPropertyType[BACnetPropertyType["propProtocolEngInqueResource"] = 2019] = "propProtocolEngInqueResource";
    BACnetPropertyType[BACnetPropertyType["propProtocolEngOutqueResource"] = 2020] = "propProtocolEngOutqueResource";
    BACnetPropertyType[BACnetPropertyType["propSaturationStatus"] = 2027] = "propSaturationStatus";
    BACnetPropertyType[BACnetPropertyType["propDebugMode"] = 2033] = "propDebugMode";
    BACnetPropertyType[BACnetPropertyType["propCount"] = 2034] = "propCount";
    BACnetPropertyType[BACnetPropertyType["propTimebase"] = 2035] = "propTimebase";
    BACnetPropertyType[BACnetPropertyType["propTotalizeLimit"] = 2037] = "propTotalizeLimit";
    BACnetPropertyType[BACnetPropertyType["propRollover"] = 2038] = "propRollover";
    BACnetPropertyType[BACnetPropertyType["propRolloverCount"] = 2039] = "propRolloverCount";
    BACnetPropertyType[BACnetPropertyType["propJciTransition"] = 2041] = "propJciTransition";
    BACnetPropertyType[BACnetPropertyType["propValuePerPulse"] = 2042] = "propValuePerPulse";
    BACnetPropertyType[BACnetPropertyType["propAddressLength"] = 2044] = "propAddressLength";
    BACnetPropertyType[BACnetPropertyType["propBroadcastAddress"] = 2045] = "propBroadcastAddress";
    BACnetPropertyType[BACnetPropertyType["propBroadcastTransmits"] = 2046] = "propBroadcastTransmits";
    BACnetPropertyType[BACnetPropertyType["propBroadcastReceives"] = 2047] = "propBroadcastReceives";
    BACnetPropertyType[BACnetPropertyType["propTransmitFailures"] = 2048] = "propTransmitFailures";
    BACnetPropertyType[BACnetPropertyType["propDiscardedFrames"] = 2051] = "propDiscardedFrames";
    BACnetPropertyType[BACnetPropertyType["propSiteData"] = 2058] = "propSiteData";
    BACnetPropertyType[BACnetPropertyType["propCalendarTimeStamp"] = 2065] = "propCalendarTimeStamp";
    BACnetPropertyType[BACnetPropertyType["propInputA"] = 2073] = "propInputA";
    BACnetPropertyType[BACnetPropertyType["propInputB"] = 2074] = "propInputB";
    BACnetPropertyType[BACnetPropertyType["propSettlingTime"] = 2075] = "propSettlingTime";
    BACnetPropertyType[BACnetPropertyType["propParentName"] = 2089] = "propParentName";
    BACnetPropertyType[BACnetPropertyType["propIntervalDemand"] = 2091] = "propIntervalDemand";
    BACnetPropertyType[BACnetPropertyType["propDemandHistory"] = 2092] = "propDemandHistory";
    BACnetPropertyType[BACnetPropertyType["propUncIntervalDemand"] = 2093] = "propUncIntervalDemand";
    BACnetPropertyType[BACnetPropertyType["propUncDemandHistory"] = 2094] = "propUncDemandHistory";
    BACnetPropertyType[BACnetPropertyType["propReleaseIn_1Min"] = 2095] = "propReleaseIn_1Min";
    BACnetPropertyType[BACnetPropertyType["propNumberOfLoads"] = 2096] = "propNumberOfLoads";
    BACnetPropertyType[BACnetPropertyType["propNotificationError"] = 2097] = "propNotificationError";
    BACnetPropertyType[BACnetPropertyType["propCurrentLrTarget"] = 2102] = "propCurrentLrTarget";
    BACnetPropertyType[BACnetPropertyType["propCurrentAmountShedByLr"] = 2103] = "propCurrentAmountShedByLr";
    BACnetPropertyType[BACnetPropertyType["propLrToShed"] = 2104] = "propLrToShed";
    BACnetPropertyType[BACnetPropertyType["propLrNotShed"] = 2105] = "propLrNotShed";
    BACnetPropertyType[BACnetPropertyType["propCurrentDemandLimit"] = 2107] = "propCurrentDemandLimit";
    BACnetPropertyType[BACnetPropertyType["propDlToShed"] = 2108] = "propDlToShed";
    BACnetPropertyType[BACnetPropertyType["propDlNotShed"] = 2109] = "propDlNotShed";
    BACnetPropertyType[BACnetPropertyType["propMeterObject"] = 2110] = "propMeterObject";
    BACnetPropertyType[BACnetPropertyType["propDemandIntervalLength"] = 2112] = "propDemandIntervalLength";
    BACnetPropertyType[BACnetPropertyType["propAlgorithm"] = 2114] = "propAlgorithm";
    BACnetPropertyType[BACnetPropertyType["propEoiAttribute"] = 2115] = "propEoiAttribute";
    BACnetPropertyType[BACnetPropertyType["propLimitElevation"] = 2117] = "propLimitElevation";
    BACnetPropertyType[BACnetPropertyType["propActiveLimit"] = 2118] = "propActiveLimit";
    BACnetPropertyType[BACnetPropertyType["propActiveElevation"] = 2119] = "propActiveElevation";
    BACnetPropertyType[BACnetPropertyType["propTimeSinceEoi"] = 2120] = "propTimeSinceEoi";
    BACnetPropertyType[BACnetPropertyType["propEnergySinceEoi"] = 2121] = "propEnergySinceEoi";
    BACnetPropertyType[BACnetPropertyType["propDemandSinceEoi"] = 2122] = "propDemandSinceEoi";
    BACnetPropertyType[BACnetPropertyType["propProfileLimit"] = 2123] = "propProfileLimit";
    BACnetPropertyType[BACnetPropertyType["propSensitivity"] = 2125] = "propSensitivity";
    BACnetPropertyType[BACnetPropertyType["propDllrStatus"] = 2128] = "propDllrStatus";
    BACnetPropertyType[BACnetPropertyType["propLoadLocked"] = 2136] = "propLoadLocked";
    BACnetPropertyType[BACnetPropertyType["propEligibility"] = 2137] = "propEligibility";
    BACnetPropertyType[BACnetPropertyType["propRate_1"] = 2143] = "propRate_1";
    BACnetPropertyType[BACnetPropertyType["propRate_2"] = 2144] = "propRate_2";
    BACnetPropertyType[BACnetPropertyType["propMinimumShedTime"] = 2146] = "propMinimumShedTime";
    BACnetPropertyType[BACnetPropertyType["propMaximumShedTime"] = 2147] = "propMaximumShedTime";
    BACnetPropertyType[BACnetPropertyType["propMinimumReleaseTime"] = 2148] = "propMinimumReleaseTime";
    BACnetPropertyType[BACnetPropertyType["propLoadPriority"] = 2149] = "propLoadPriority";
    BACnetPropertyType[BACnetPropertyType["propTimeShed"] = 2151] = "propTimeShed";
    BACnetPropertyType[BACnetPropertyType["propTimeReleased"] = 2152] = "propTimeReleased";
    BACnetPropertyType[BACnetPropertyType["propVmaBacErrors"] = 2155] = "propVmaBacErrors";
    BACnetPropertyType[BACnetPropertyType["propVmaFmtErrors"] = 2156] = "propVmaFmtErrors";
    BACnetPropertyType[BACnetPropertyType["propVmaCovErrors"] = 2157] = "propVmaCovErrors";
    BACnetPropertyType[BACnetPropertyType["propCommunicationOption"] = 2159] = "propCommunicationOption";
    BACnetPropertyType[BACnetPropertyType["propRelativeTempUnits"] = 2167] = "propRelativeTempUnits";
    BACnetPropertyType[BACnetPropertyType["propDictionaryLanguage"] = 2168] = "propDictionaryLanguage";
    BACnetPropertyType[BACnetPropertyType["propExecuteCount"] = 2171] = "propExecuteCount";
    BACnetPropertyType[BACnetPropertyType["propMstpBaudRate"] = 2173] = "propMstpBaudRate";
    BACnetPropertyType[BACnetPropertyType["propSimulationSpeedUp"] = 2177] = "propSimulationSpeedUp";
    BACnetPropertyType[BACnetPropertyType["propSimulationTime"] = 2178] = "propSimulationTime";
    BACnetPropertyType[BACnetPropertyType["propFieldOffset"] = 2179] = "propFieldOffset";
    BACnetPropertyType[BACnetPropertyType["propFieldUnits"] = 2180] = "propFieldUnits";
    BACnetPropertyType[BACnetPropertyType["propAccumulator"] = 2182] = "propAccumulator";
    BACnetPropertyType[BACnetPropertyType["propHardwareType"] = 2184] = "propHardwareType";
    BACnetPropertyType[BACnetPropertyType["propWriteCount"] = 2191] = "propWriteCount";
    BACnetPropertyType[BACnetPropertyType["propPeriodicUpdate"] = 2192] = "propPeriodicUpdate";
    BACnetPropertyType[BACnetPropertyType["propOccupancyTime"] = 2193] = "propOccupancyTime";
    BACnetPropertyType[BACnetPropertyType["propOutputValue"] = 2195] = "propOutputValue";
    BACnetPropertyType[BACnetPropertyType["propExecutionPriority"] = 2197] = "propExecutionPriority";
    BACnetPropertyType[BACnetPropertyType["propMinCycleTime"] = 2199] = "propMinCycleTime";
    BACnetPropertyType[BACnetPropertyType["propPropertyRefValue"] = 2202] = "propPropertyRefValue";
    BACnetPropertyType[BACnetPropertyType["propDeadband"] = 2205] = "propDeadband";
    BACnetPropertyType[BACnetPropertyType["propDefaultBaseUnits"] = 2206] = "propDefaultBaseUnits";
    BACnetPropertyType[BACnetPropertyType["propDisplayUnits"] = 2207] = "propDisplayUnits";
    BACnetPropertyType[BACnetPropertyType["propTargetReference"] = 2208] = "propTargetReference";
    BACnetPropertyType[BACnetPropertyType["propPureBacnetHandling"] = 2211] = "propPureBacnetHandling";
    BACnetPropertyType[BACnetPropertyType["propLoopNumber"] = 2228] = "propLoopNumber";
    BACnetPropertyType[BACnetPropertyType["propOutputDelay"] = 2231] = "propOutputDelay";
    BACnetPropertyType[BACnetPropertyType["propSupervised"] = 2247] = "propSupervised";
    BACnetPropertyType[BACnetPropertyType["propTriggerValue"] = 2260] = "propTriggerValue";
    BACnetPropertyType[BACnetPropertyType["propOverrideEnable"] = 2271] = "propOverrideEnable";
    BACnetPropertyType[BACnetPropertyType["propMaxMessagesQueued"] = 2289] = "propMaxMessagesQueued";
    BACnetPropertyType[BACnetPropertyType["propExtendedProtoVer"] = 2291] = "propExtendedProtoVer";
    BACnetPropertyType[BACnetPropertyType["propInterstageOffDelay"] = 2293] = "propInterstageOffDelay";
    BACnetPropertyType[BACnetPropertyType["propReportDelay"] = 2294] = "propReportDelay";
    BACnetPropertyType[BACnetPropertyType["propReportDelayActive"] = 2295] = "propReportDelayActive";
    BACnetPropertyType[BACnetPropertyType["propDiagnosticMessages"] = 2298] = "propDiagnosticMessages";
    BACnetPropertyType[BACnetPropertyType["propFreeApplMemory"] = 2301] = "propFreeApplMemory";
    BACnetPropertyType[BACnetPropertyType["propLastAlarm"] = 2304] = "propLastAlarm";
    BACnetPropertyType[BACnetPropertyType["propDatabaseId"] = 2305] = "propDatabaseId";
    BACnetPropertyType[BACnetPropertyType["propDay"] = 2320] = "propDay";
    BACnetPropertyType[BACnetPropertyType["propDayOfWeek"] = 2321] = "propDayOfWeek";
    BACnetPropertyType[BACnetPropertyType["propMonth"] = 2322] = "propMonth";
    BACnetPropertyType[BACnetPropertyType["propYear"] = 2323] = "propYear";
    BACnetPropertyType[BACnetPropertyType["propModel"] = 2324] = "propModel";
    BACnetPropertyType[BACnetPropertyType["propRefreshTimer"] = 2325] = "propRefreshTimer";
    BACnetPropertyType[BACnetPropertyType["propApplicationType"] = 2330] = "propApplicationType";
    BACnetPropertyType[BACnetPropertyType["propMappingInfo"] = 2331] = "propMappingInfo";
    BACnetPropertyType[BACnetPropertyType["propDomainName"] = 2334] = "propDomainName";
    BACnetPropertyType[BACnetPropertyType["propDnsRefreshPeriod"] = 2336] = "propDnsRefreshPeriod";
    BACnetPropertyType[BACnetPropertyType["propBmHostNameList"] = 2338] = "propBmHostNameList";
    BACnetPropertyType[BACnetPropertyType["propHostNameStatus"] = 2339] = "propHostNameStatus";
    BACnetPropertyType[BACnetPropertyType["propInput_3"] = 2362] = "propInput_3";
    BACnetPropertyType[BACnetPropertyType["propInput_4"] = 2363] = "propInput_4";
    BACnetPropertyType[BACnetPropertyType["propInput_5"] = 2364] = "propInput_5";
    BACnetPropertyType[BACnetPropertyType["propInput_6"] = 2365] = "propInput_6";
    BACnetPropertyType[BACnetPropertyType["propInput_7"] = 2366] = "propInput_7";
    BACnetPropertyType[BACnetPropertyType["propInput_8"] = 2367] = "propInput_8";
    BACnetPropertyType[BACnetPropertyType["propInput_9"] = 2368] = "propInput_9";
    BACnetPropertyType[BACnetPropertyType["propInput_10"] = 2369] = "propInput_10";
    BACnetPropertyType[BACnetPropertyType["propInput_11"] = 2370] = "propInput_11";
    BACnetPropertyType[BACnetPropertyType["propInput_12"] = 2371] = "propInput_12";
    BACnetPropertyType[BACnetPropertyType["propInput_13"] = 2372] = "propInput_13";
    BACnetPropertyType[BACnetPropertyType["propInput_14"] = 2373] = "propInput_14";
    BACnetPropertyType[BACnetPropertyType["propInput_15"] = 2374] = "propInput_15";
    BACnetPropertyType[BACnetPropertyType["propInput_16"] = 2375] = "propInput_16";
    BACnetPropertyType[BACnetPropertyType["propInput_17"] = 2376] = "propInput_17";
    BACnetPropertyType[BACnetPropertyType["propInput_18"] = 2377] = "propInput_18";
    BACnetPropertyType[BACnetPropertyType["propInput_19"] = 2378] = "propInput_19";
    BACnetPropertyType[BACnetPropertyType["propInput_20"] = 2379] = "propInput_20";
    BACnetPropertyType[BACnetPropertyType["propInputCount"] = 2380] = "propInputCount";
    BACnetPropertyType[BACnetPropertyType["propModeSetup"] = 2381] = "propModeSetup";
    BACnetPropertyType[BACnetPropertyType["propDryBulbTemperature"] = 2382] = "propDryBulbTemperature";
    BACnetPropertyType[BACnetPropertyType["propElevation"] = 2383] = "propElevation";
    BACnetPropertyType[BACnetPropertyType["propDewPointRh"] = 2384] = "propDewPointRh";
    BACnetPropertyType[BACnetPropertyType["propDewPointWb"] = 2385] = "propDewPointWb";
    BACnetPropertyType[BACnetPropertyType["propClampHighest"] = 2386] = "propClampHighest";
    BACnetPropertyType[BACnetPropertyType["propClampLowest"] = 2387] = "propClampLowest";
    BACnetPropertyType[BACnetPropertyType["propScalingConstant"] = 2388] = "propScalingConstant";
    BACnetPropertyType[BACnetPropertyType["propDeviceConstant"] = 2389] = "propDeviceConstant";
    BACnetPropertyType[BACnetPropertyType["propName"] = 2390] = "propName";
    BACnetPropertyType[BACnetPropertyType["propMaxDelay"] = 2391] = "propMaxDelay";
    BACnetPropertyType[BACnetPropertyType["propCommandReference"] = 2394] = "propCommandReference";
    BACnetPropertyType[BACnetPropertyType["propEstimatedFlashAvailable"] = 2395] = "propEstimatedFlashAvailable";
    BACnetPropertyType[BACnetPropertyType["propDevice_1Out"] = 2396] = "propDevice_1Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_2Out"] = 2397] = "propDevice_2Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_3Out"] = 2398] = "propDevice_3Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_4Out"] = 2399] = "propDevice_4Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_5Out"] = 2400] = "propDevice_5Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_6Out"] = 2401] = "propDevice_6Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_7Out"] = 2402] = "propDevice_7Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_8Out"] = 2403] = "propDevice_8Out";
    BACnetPropertyType[BACnetPropertyType["propDevice_1Enable"] = 2404] = "propDevice_1Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_2Enable"] = 2405] = "propDevice_2Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_3Enable"] = 2406] = "propDevice_3Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_4Enable"] = 2407] = "propDevice_4Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_5Enable"] = 2408] = "propDevice_5Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_6Enable"] = 2409] = "propDevice_6Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_7Enable"] = 2410] = "propDevice_7Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_8Enable"] = 2411] = "propDevice_8Enable";
    BACnetPropertyType[BACnetPropertyType["propDevice_1Rank"] = 2412] = "propDevice_1Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_2Rank"] = 2413] = "propDevice_2Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_3Rank"] = 2414] = "propDevice_3Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_4Rank"] = 2415] = "propDevice_4Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_5Rank"] = 2416] = "propDevice_5Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_6Rank"] = 2417] = "propDevice_6Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_7Rank"] = 2418] = "propDevice_7Rank";
    BACnetPropertyType[BACnetPropertyType["propDevice_8Rank"] = 2419] = "propDevice_8Rank";
    BACnetPropertyType[BACnetPropertyType["propRotateNow"] = 2420] = "propRotateNow";
    BACnetPropertyType[BACnetPropertyType["propProactive"] = 2421] = "propProactive";
    BACnetPropertyType[BACnetPropertyType["propNumberOfOutputs"] = 2422] = "propNumberOfOutputs";
    BACnetPropertyType[BACnetPropertyType["propBaseDownloadFlashAvailable"] = 2423] = "propBaseDownloadFlashAvailable";
    BACnetPropertyType[BACnetPropertyType["propDisplayReference"] = 2424] = "propDisplayReference";
    BACnetPropertyType[BACnetPropertyType["propSequenceOrder"] = 2425] = "propSequenceOrder";
    BACnetPropertyType[BACnetPropertyType["propLatchStatistics"] = 2426] = "propLatchStatistics";
    BACnetPropertyType[BACnetPropertyType["propClearStatistics"] = 2427] = "propClearStatistics";
    BACnetPropertyType[BACnetPropertyType["propInput_21"] = 2500] = "propInput_21";
    BACnetPropertyType[BACnetPropertyType["propInput_22"] = 2501] = "propInput_22";
    BACnetPropertyType[BACnetPropertyType["propInput_23"] = 2502] = "propInput_23";
    BACnetPropertyType[BACnetPropertyType["propInput_24"] = 2503] = "propInput_24";
    BACnetPropertyType[BACnetPropertyType["propOutput_1"] = 2505] = "propOutput_1";
    BACnetPropertyType[BACnetPropertyType["propOutput_2"] = 2506] = "propOutput_2";
    BACnetPropertyType[BACnetPropertyType["propOutput_3"] = 2507] = "propOutput_3";
    BACnetPropertyType[BACnetPropertyType["propOutput_4"] = 2508] = "propOutput_4";
    BACnetPropertyType[BACnetPropertyType["propOutput_5"] = 2509] = "propOutput_5";
    BACnetPropertyType[BACnetPropertyType["propOutput_6"] = 2510] = "propOutput_6";
    BACnetPropertyType[BACnetPropertyType["propOutput_7"] = 2511] = "propOutput_7";
    BACnetPropertyType[BACnetPropertyType["propOutput_8"] = 2512] = "propOutput_8";
    BACnetPropertyType[BACnetPropertyType["propOutput_9"] = 2513] = "propOutput_9";
    BACnetPropertyType[BACnetPropertyType["propOutput_10"] = 2514] = "propOutput_10";
    BACnetPropertyType[BACnetPropertyType["propOutput_11"] = 2515] = "propOutput_11";
    BACnetPropertyType[BACnetPropertyType["propOutput_12"] = 2516] = "propOutput_12";
    BACnetPropertyType[BACnetPropertyType["propOutput_13"] = 2517] = "propOutput_13";
    BACnetPropertyType[BACnetPropertyType["propOutput_14"] = 2518] = "propOutput_14";
    BACnetPropertyType[BACnetPropertyType["propOutput_15"] = 2519] = "propOutput_15";
    BACnetPropertyType[BACnetPropertyType["propOutput_16"] = 2520] = "propOutput_16";
    BACnetPropertyType[BACnetPropertyType["propOutput_17"] = 2521] = "propOutput_17";
    BACnetPropertyType[BACnetPropertyType["propOutput_18"] = 2522] = "propOutput_18";
    BACnetPropertyType[BACnetPropertyType["propOutput_19"] = 2523] = "propOutput_19";
    BACnetPropertyType[BACnetPropertyType["propOutput_20"] = 2524] = "propOutput_20";
    BACnetPropertyType[BACnetPropertyType["propOutput_21"] = 2525] = "propOutput_21";
    BACnetPropertyType[BACnetPropertyType["propOutput_22"] = 2526] = "propOutput_22";
    BACnetPropertyType[BACnetPropertyType["propOutput_23"] = 2527] = "propOutput_23";
    BACnetPropertyType[BACnetPropertyType["propOutput_24"] = 2528] = "propOutput_24";
    BACnetPropertyType[BACnetPropertyType["propLogicSequence"] = 2529] = "propLogicSequence";
    BACnetPropertyType[BACnetPropertyType["propAttrChangeCount"] = 2530] = "propAttrChangeCount";
    BACnetPropertyType[BACnetPropertyType["propTitle"] = 2531] = "propTitle";
    BACnetPropertyType[BACnetPropertyType["propSubtitle"] = 2532] = "propSubtitle";
    BACnetPropertyType[BACnetPropertyType["propRefreshRate"] = 2533] = "propRefreshRate";
    BACnetPropertyType[BACnetPropertyType["propTrendStartDate"] = 2534] = "propTrendStartDate";
    BACnetPropertyType[BACnetPropertyType["propEndDate"] = 2535] = "propEndDate";
    BACnetPropertyType[BACnetPropertyType["propRelativeStartIndicator"] = 2536] = "propRelativeStartIndicator";
    BACnetPropertyType[BACnetPropertyType["propRelativeStartTime"] = 2537] = "propRelativeStartTime";
    BACnetPropertyType[BACnetPropertyType["propRelativeStartOffset"] = 2538] = "propRelativeStartOffset";
    BACnetPropertyType[BACnetPropertyType["propRelativeEndIndicator"] = 2539] = "propRelativeEndIndicator";
    BACnetPropertyType[BACnetPropertyType["propRelativeEndTime"] = 2540] = "propRelativeEndTime";
    BACnetPropertyType[BACnetPropertyType["propRelativeEndOffset"] = 2541] = "propRelativeEndOffset";
    BACnetPropertyType[BACnetPropertyType["propGridlines"] = 2542] = "propGridlines";
    BACnetPropertyType[BACnetPropertyType["propStackedYAxis"] = 2543] = "propStackedYAxis";
    BACnetPropertyType[BACnetPropertyType["propShowLegend"] = 2544] = "propShowLegend";
    BACnetPropertyType[BACnetPropertyType["propShowMarkers"] = 2545] = "propShowMarkers";
    BACnetPropertyType[BACnetPropertyType["propChartStyle"] = 2546] = "propChartStyle";
    BACnetPropertyType[BACnetPropertyType["propListOfObjects"] = 2547] = "propListOfObjects";
    BACnetPropertyType[BACnetPropertyType["propEndTime"] = 2548] = "propEndTime";
    BACnetPropertyType[BACnetPropertyType["propRepositoryEnabled"] = 2549] = "propRepositoryEnabled";
    BACnetPropertyType[BACnetPropertyType["propTransferSetpoint"] = 2550] = "propTransferSetpoint";
    BACnetPropertyType[BACnetPropertyType["propRouteTrigger"] = 2552] = "propRouteTrigger";
    BACnetPropertyType[BACnetPropertyType["propSamplesNotSentToAds"] = 2553] = "propSamplesNotSentToAds";
    BACnetPropertyType[BACnetPropertyType["propAttributeInformation"] = 2554] = "propAttributeInformation";
    BACnetPropertyType[BACnetPropertyType["propNetworkName"] = 2555] = "propNetworkName";
    BACnetPropertyType[BACnetPropertyType["propGateNumber"] = 2556] = "propGateNumber";
    BACnetPropertyType[BACnetPropertyType["propDutyStandby"] = 2557] = "propDutyStandby";
    BACnetPropertyType[BACnetPropertyType["propUdpPort"] = 2558] = "propUdpPort";
    BACnetPropertyType[BACnetPropertyType["propDiscoveryGateNumber"] = 2559] = "propDiscoveryGateNumber";
    BACnetPropertyType[BACnetPropertyType["propDiscoveryNodeNumber"] = 2560] = "propDiscoveryNodeNumber";
    BACnetPropertyType[BACnetPropertyType["propDiscoveryIpAddress"] = 2561] = "propDiscoveryIpAddress";
    BACnetPropertyType[BACnetPropertyType["propNcmName"] = 2562] = "propNcmName";
    BACnetPropertyType[BACnetPropertyType["propMessageErrors"] = 2563] = "propMessageErrors";
    BACnetPropertyType[BACnetPropertyType["propRemoteObjectName"] = 2564] = "propRemoteObjectName";
    BACnetPropertyType[BACnetPropertyType["propBufferState"] = 2565] = "propBufferState";
    BACnetPropertyType[BACnetPropertyType["propSampleInterval"] = 2566] = "propSampleInterval";
    BACnetPropertyType[BACnetPropertyType["propFailsoft"] = 2567] = "propFailsoft";
    BACnetPropertyType[BACnetPropertyType["propAdsRepositories"] = 2568] = "propAdsRepositories";
    BACnetPropertyType[BACnetPropertyType["propHour"] = 2569] = "propHour";
    BACnetPropertyType[BACnetPropertyType["propMinute"] = 2570] = "propMinute";
    BACnetPropertyType[BACnetPropertyType["propJciEventParameters"] = 2571] = "propJciEventParameters";
    BACnetPropertyType[BACnetPropertyType["propJciGroupMembers"] = 2572] = "propJciGroupMembers";
    BACnetPropertyType[BACnetPropertyType["propJciExceptionSchedule"] = 2573] = "propJciExceptionSchedule";
    BACnetPropertyType[BACnetPropertyType["propJciPropertyReferences"] = 2574] = "propJciPropertyReferences";
    BACnetPropertyType[BACnetPropertyType["propDisplayAttribute"] = 2576] = "propDisplayAttribute";
    BACnetPropertyType[BACnetPropertyType["propDeviceReference"] = 2577] = "propDeviceReference";
    BACnetPropertyType[BACnetPropertyType["propCpuTemperature"] = 2579] = "propCpuTemperature";
    BACnetPropertyType[BACnetPropertyType["propBoardTemperature"] = 2580] = "propBoardTemperature";
    BACnetPropertyType[BACnetPropertyType["propMemoryUsage"] = 2581] = "propMemoryUsage";
    BACnetPropertyType[BACnetPropertyType["propObjectMemoryUsage"] = 2582] = "propObjectMemoryUsage";
    BACnetPropertyType[BACnetPropertyType["propCpuUsage"] = 2583] = "propCpuUsage";
    BACnetPropertyType[BACnetPropertyType["propFlashUsage"] = 2584] = "propFlashUsage";
    BACnetPropertyType[BACnetPropertyType["propDefaultAdsPriorityThreshold"] = 2585] = "propDefaultAdsPriorityThreshold";
    BACnetPropertyType[BACnetPropertyType["propAdsPriorityThreshold"] = 2586] = "propAdsPriorityThreshold";
    BACnetPropertyType[BACnetPropertyType["propDuplicateDeviceIdentifiers"] = 2587] = "propDuplicateDeviceIdentifiers";
    BACnetPropertyType[BACnetPropertyType["propDynamicBroadcastManagement"] = 2588] = "propDynamicBroadcastManagement";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_1"] = 2601] = "propGioAttribute_1";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_2"] = 2602] = "propGioAttribute_2";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_3"] = 2603] = "propGioAttribute_3";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_4"] = 2604] = "propGioAttribute_4";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_5"] = 2605] = "propGioAttribute_5";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_6"] = 2606] = "propGioAttribute_6";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_7"] = 2607] = "propGioAttribute_7";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_8"] = 2608] = "propGioAttribute_8";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_9"] = 2609] = "propGioAttribute_9";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_10"] = 2610] = "propGioAttribute_10";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_11"] = 2611] = "propGioAttribute_11";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_12"] = 2612] = "propGioAttribute_12";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_13"] = 2613] = "propGioAttribute_13";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_14"] = 2614] = "propGioAttribute_14";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_15"] = 2615] = "propGioAttribute_15";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_16"] = 2616] = "propGioAttribute_16";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_17"] = 2617] = "propGioAttribute_17";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_18"] = 2618] = "propGioAttribute_18";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_19"] = 2619] = "propGioAttribute_19";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_20"] = 2620] = "propGioAttribute_20";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_21"] = 2621] = "propGioAttribute_21";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_22"] = 2622] = "propGioAttribute_22";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_23"] = 2623] = "propGioAttribute_23";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_24"] = 2624] = "propGioAttribute_24";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_25"] = 2625] = "propGioAttribute_25";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_26"] = 2626] = "propGioAttribute_26";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_27"] = 2627] = "propGioAttribute_27";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_28"] = 2628] = "propGioAttribute_28";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_29"] = 2629] = "propGioAttribute_29";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_30"] = 2630] = "propGioAttribute_30";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_31"] = 2631] = "propGioAttribute_31";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_32"] = 2632] = "propGioAttribute_32";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_33"] = 2633] = "propGioAttribute_33";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_34"] = 2634] = "propGioAttribute_34";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_35"] = 2635] = "propGioAttribute_35";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_36"] = 2636] = "propGioAttribute_36";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_37"] = 2637] = "propGioAttribute_37";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_38"] = 2638] = "propGioAttribute_38";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_39"] = 2639] = "propGioAttribute_39";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_40"] = 2640] = "propGioAttribute_40";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_41"] = 2641] = "propGioAttribute_41";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_42"] = 2642] = "propGioAttribute_42";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_43"] = 2643] = "propGioAttribute_43";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_44"] = 2644] = "propGioAttribute_44";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_45"] = 2645] = "propGioAttribute_45";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_46"] = 2646] = "propGioAttribute_46";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_47"] = 2647] = "propGioAttribute_47";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_48"] = 2648] = "propGioAttribute_48";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_49"] = 2649] = "propGioAttribute_49";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_50"] = 2650] = "propGioAttribute_50";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_51"] = 2651] = "propGioAttribute_51";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_52"] = 2652] = "propGioAttribute_52";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_53"] = 2653] = "propGioAttribute_53";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_54"] = 2654] = "propGioAttribute_54";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_55"] = 2655] = "propGioAttribute_55";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_56"] = 2656] = "propGioAttribute_56";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_57"] = 2657] = "propGioAttribute_57";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_58"] = 2658] = "propGioAttribute_58";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_59"] = 2659] = "propGioAttribute_59";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_60"] = 2660] = "propGioAttribute_60";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_61"] = 2661] = "propGioAttribute_61";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_62"] = 2662] = "propGioAttribute_62";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_63"] = 2663] = "propGioAttribute_63";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_64"] = 2664] = "propGioAttribute_64";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_65"] = 2665] = "propGioAttribute_65";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_66"] = 2666] = "propGioAttribute_66";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_67"] = 2667] = "propGioAttribute_67";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_68"] = 2668] = "propGioAttribute_68";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_69"] = 2669] = "propGioAttribute_69";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_70"] = 2670] = "propGioAttribute_70";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_71"] = 2671] = "propGioAttribute_71";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_72"] = 2672] = "propGioAttribute_72";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_73"] = 2673] = "propGioAttribute_73";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_74"] = 2674] = "propGioAttribute_74";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_75"] = 2675] = "propGioAttribute_75";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_76"] = 2676] = "propGioAttribute_76";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_77"] = 2677] = "propGioAttribute_77";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_78"] = 2678] = "propGioAttribute_78";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_79"] = 2679] = "propGioAttribute_79";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_80"] = 2680] = "propGioAttribute_80";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_81"] = 2681] = "propGioAttribute_81";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_82"] = 2682] = "propGioAttribute_82";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_83"] = 2683] = "propGioAttribute_83";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_84"] = 2684] = "propGioAttribute_84";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_85"] = 2685] = "propGioAttribute_85";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_86"] = 2686] = "propGioAttribute_86";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_87"] = 2687] = "propGioAttribute_87";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_88"] = 2688] = "propGioAttribute_88";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_89"] = 2689] = "propGioAttribute_89";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_90"] = 2690] = "propGioAttribute_90";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_91"] = 2691] = "propGioAttribute_91";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_92"] = 2692] = "propGioAttribute_92";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_93"] = 2693] = "propGioAttribute_93";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_94"] = 2694] = "propGioAttribute_94";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_95"] = 2695] = "propGioAttribute_95";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_96"] = 2696] = "propGioAttribute_96";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_97"] = 2697] = "propGioAttribute_97";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_98"] = 2698] = "propGioAttribute_98";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_99"] = 2699] = "propGioAttribute_99";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_100"] = 2700] = "propGioAttribute_100";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_101"] = 2701] = "propGioAttribute_101";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_102"] = 2702] = "propGioAttribute_102";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_103"] = 2703] = "propGioAttribute_103";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_104"] = 2704] = "propGioAttribute_104";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_105"] = 2705] = "propGioAttribute_105";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_106"] = 2706] = "propGioAttribute_106";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_107"] = 2707] = "propGioAttribute_107";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_108"] = 2708] = "propGioAttribute_108";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_109"] = 2709] = "propGioAttribute_109";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_110"] = 2710] = "propGioAttribute_110";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_111"] = 2711] = "propGioAttribute_111";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_112"] = 2712] = "propGioAttribute_112";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_113"] = 2713] = "propGioAttribute_113";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_114"] = 2714] = "propGioAttribute_114";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_115"] = 2715] = "propGioAttribute_115";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_116"] = 2716] = "propGioAttribute_116";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_117"] = 2717] = "propGioAttribute_117";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_118"] = 2718] = "propGioAttribute_118";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_119"] = 2719] = "propGioAttribute_119";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_120"] = 2720] = "propGioAttribute_120";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_121"] = 2721] = "propGioAttribute_121";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_122"] = 2722] = "propGioAttribute_122";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_123"] = 2723] = "propGioAttribute_123";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_124"] = 2724] = "propGioAttribute_124";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_125"] = 2725] = "propGioAttribute_125";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_126"] = 2726] = "propGioAttribute_126";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_127"] = 2727] = "propGioAttribute_127";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_128"] = 2728] = "propGioAttribute_128";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_129"] = 2729] = "propGioAttribute_129";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_130"] = 2730] = "propGioAttribute_130";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_131"] = 2731] = "propGioAttribute_131";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_132"] = 2732] = "propGioAttribute_132";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_133"] = 2733] = "propGioAttribute_133";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_134"] = 2734] = "propGioAttribute_134";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_135"] = 2735] = "propGioAttribute_135";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_136"] = 2736] = "propGioAttribute_136";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_137"] = 2737] = "propGioAttribute_137";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_138"] = 2738] = "propGioAttribute_138";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_139"] = 2739] = "propGioAttribute_139";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_140"] = 2740] = "propGioAttribute_140";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_141"] = 2741] = "propGioAttribute_141";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_142"] = 2742] = "propGioAttribute_142";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_143"] = 2743] = "propGioAttribute_143";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_144"] = 2744] = "propGioAttribute_144";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_145"] = 2745] = "propGioAttribute_145";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_146"] = 2746] = "propGioAttribute_146";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_147"] = 2747] = "propGioAttribute_147";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_148"] = 2748] = "propGioAttribute_148";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_149"] = 2749] = "propGioAttribute_149";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_150"] = 2750] = "propGioAttribute_150";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_151"] = 2751] = "propGioAttribute_151";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_152"] = 2752] = "propGioAttribute_152";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_153"] = 2753] = "propGioAttribute_153";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_154"] = 2754] = "propGioAttribute_154";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_155"] = 2755] = "propGioAttribute_155";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_156"] = 2756] = "propGioAttribute_156";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_157"] = 2757] = "propGioAttribute_157";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_158"] = 2758] = "propGioAttribute_158";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_159"] = 2759] = "propGioAttribute_159";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_160"] = 2760] = "propGioAttribute_160";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_161"] = 2761] = "propGioAttribute_161";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_162"] = 2762] = "propGioAttribute_162";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_163"] = 2763] = "propGioAttribute_163";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_164"] = 2764] = "propGioAttribute_164";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_165"] = 2765] = "propGioAttribute_165";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_166"] = 2766] = "propGioAttribute_166";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_167"] = 2767] = "propGioAttribute_167";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_168"] = 2768] = "propGioAttribute_168";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_169"] = 2769] = "propGioAttribute_169";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_170"] = 2770] = "propGioAttribute_170";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_171"] = 2771] = "propGioAttribute_171";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_172"] = 2772] = "propGioAttribute_172";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_173"] = 2773] = "propGioAttribute_173";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_174"] = 2774] = "propGioAttribute_174";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_175"] = 2775] = "propGioAttribute_175";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_176"] = 2776] = "propGioAttribute_176";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_177"] = 2777] = "propGioAttribute_177";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_178"] = 2778] = "propGioAttribute_178";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_179"] = 2779] = "propGioAttribute_179";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_180"] = 2780] = "propGioAttribute_180";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_181"] = 2781] = "propGioAttribute_181";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_182"] = 2782] = "propGioAttribute_182";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_183"] = 2783] = "propGioAttribute_183";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_184"] = 2784] = "propGioAttribute_184";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_185"] = 2785] = "propGioAttribute_185";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_186"] = 2786] = "propGioAttribute_186";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_187"] = 2787] = "propGioAttribute_187";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_188"] = 2788] = "propGioAttribute_188";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_189"] = 2789] = "propGioAttribute_189";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_190"] = 2790] = "propGioAttribute_190";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_191"] = 2791] = "propGioAttribute_191";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_192"] = 2792] = "propGioAttribute_192";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_193"] = 2793] = "propGioAttribute_193";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_194"] = 2794] = "propGioAttribute_194";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_195"] = 2795] = "propGioAttribute_195";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_196"] = 2796] = "propGioAttribute_196";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_197"] = 2797] = "propGioAttribute_197";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_198"] = 2798] = "propGioAttribute_198";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_199"] = 2799] = "propGioAttribute_199";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_200"] = 2800] = "propGioAttribute_200";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_201"] = 2801] = "propGioAttribute_201";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_202"] = 2802] = "propGioAttribute_202";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_203"] = 2803] = "propGioAttribute_203";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_204"] = 2804] = "propGioAttribute_204";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_205"] = 2805] = "propGioAttribute_205";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_206"] = 2806] = "propGioAttribute_206";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_207"] = 2807] = "propGioAttribute_207";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_208"] = 2808] = "propGioAttribute_208";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_209"] = 2809] = "propGioAttribute_209";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_210"] = 2810] = "propGioAttribute_210";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_211"] = 2811] = "propGioAttribute_211";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_212"] = 2812] = "propGioAttribute_212";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_213"] = 2813] = "propGioAttribute_213";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_214"] = 2814] = "propGioAttribute_214";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_215"] = 2815] = "propGioAttribute_215";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_216"] = 2816] = "propGioAttribute_216";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_217"] = 2817] = "propGioAttribute_217";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_218"] = 2818] = "propGioAttribute_218";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_219"] = 2819] = "propGioAttribute_219";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_220"] = 2820] = "propGioAttribute_220";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_221"] = 2821] = "propGioAttribute_221";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_222"] = 2822] = "propGioAttribute_222";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_223"] = 2823] = "propGioAttribute_223";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_224"] = 2824] = "propGioAttribute_224";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_225"] = 2825] = "propGioAttribute_225";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_226"] = 2826] = "propGioAttribute_226";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_227"] = 2827] = "propGioAttribute_227";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_228"] = 2828] = "propGioAttribute_228";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_229"] = 2829] = "propGioAttribute_229";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_230"] = 2830] = "propGioAttribute_230";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_231"] = 2831] = "propGioAttribute_231";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_232"] = 2832] = "propGioAttribute_232";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_233"] = 2833] = "propGioAttribute_233";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_234"] = 2834] = "propGioAttribute_234";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_235"] = 2835] = "propGioAttribute_235";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_236"] = 2836] = "propGioAttribute_236";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_237"] = 2837] = "propGioAttribute_237";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_238"] = 2838] = "propGioAttribute_238";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_239"] = 2839] = "propGioAttribute_239";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_240"] = 2840] = "propGioAttribute_240";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_241"] = 2841] = "propGioAttribute_241";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_242"] = 2842] = "propGioAttribute_242";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_243"] = 2843] = "propGioAttribute_243";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_244"] = 2844] = "propGioAttribute_244";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_245"] = 2845] = "propGioAttribute_245";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_246"] = 2846] = "propGioAttribute_246";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_247"] = 2847] = "propGioAttribute_247";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_248"] = 2848] = "propGioAttribute_248";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_249"] = 2849] = "propGioAttribute_249";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_250"] = 2850] = "propGioAttribute_250";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_251"] = 2851] = "propGioAttribute_251";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_252"] = 2852] = "propGioAttribute_252";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_253"] = 2853] = "propGioAttribute_253";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_254"] = 2854] = "propGioAttribute_254";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_255"] = 2855] = "propGioAttribute_255";
    BACnetPropertyType[BACnetPropertyType["propGioAttribute_256"] = 2856] = "propGioAttribute_256";
    BACnetPropertyType[BACnetPropertyType["propJciMacAddress"] = 2858] = "propJciMacAddress";
    BACnetPropertyType[BACnetPropertyType["propBaudRateSelection"] = 2860] = "propBaudRateSelection";
    BACnetPropertyType[BACnetPropertyType["propActiveBaudRate"] = 2861] = "propActiveBaudRate";
    BACnetPropertyType[BACnetPropertyType["propSoftwareAddressingEnabled"] = 2863] = "propSoftwareAddressingEnabled";
    BACnetPropertyType[BACnetPropertyType["propUsageTimeout"] = 2864] = "propUsageTimeout";
    BACnetPropertyType[BACnetPropertyType["propReplyTimeout"] = 2865] = "propReplyTimeout";
    BACnetPropertyType[BACnetPropertyType["propPortStatus"] = 2866] = "propPortStatus";
    BACnetPropertyType[BACnetPropertyType["propTokenFramesTxed"] = 2867] = "propTokenFramesTxed";
    BACnetPropertyType[BACnetPropertyType["propTokenFramesRxed"] = 2868] = "propTokenFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propPfmFramesTxed"] = 2869] = "propPfmFramesTxed";
    BACnetPropertyType[BACnetPropertyType["propPfmFramesRxed"] = 2870] = "propPfmFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propReplyToPfmFramesTxed"] = 2871] = "propReplyToPfmFramesTxed";
    BACnetPropertyType[BACnetPropertyType["propReplyToPfmFramesRxed"] = 2872] = "propReplyToPfmFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propTestRequestFramesTxed"] = 2873] = "propTestRequestFramesTxed";
    BACnetPropertyType[BACnetPropertyType["propTestRequestFramesRxed"] = 2874] = "propTestRequestFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propTestResponseFramesTxed"] = 2875] = "propTestResponseFramesTxed";
    BACnetPropertyType[BACnetPropertyType["propTestResponseFramesRxed"] = 2876] = "propTestResponseFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propDataExpectingReplyFramesTx"] = 2877] = "propDataExpectingReplyFramesTx";
    BACnetPropertyType[BACnetPropertyType["propDataExpectingReplyFramesRx"] = 2878] = "propDataExpectingReplyFramesRx";
    BACnetPropertyType[BACnetPropertyType["propDataNotExpectingReplyFrame"] = 2879] = "propDataNotExpectingReplyFrame";
    BACnetPropertyType[BACnetPropertyType["propReplyPostponedFramesTxed"] = 2881] = "propReplyPostponedFramesTxed";
    BACnetPropertyType[BACnetPropertyType["propReplyPostponedFramesRxed"] = 2882] = "propReplyPostponedFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propUnexpectedFramesRxed"] = 2883] = "propUnexpectedFramesRxed";
    BACnetPropertyType[BACnetPropertyType["propPacketsTimedOut"] = 2884] = "propPacketsTimedOut";
    BACnetPropertyType[BACnetPropertyType["propPacketsTooLong"] = 2885] = "propPacketsTooLong";
    BACnetPropertyType[BACnetPropertyType["propOverrunErrors"] = 2886] = "propOverrunErrors";
    BACnetPropertyType[BACnetPropertyType["propHeaderCrcErrors"] = 2887] = "propHeaderCrcErrors";
    BACnetPropertyType[BACnetPropertyType["propDataCrcErrors"] = 2888] = "propDataCrcErrors";
    BACnetPropertyType[BACnetPropertyType["propReplyTooSlowDatalinkErrors"] = 2889] = "propReplyTooSlowDatalinkErrors";
    BACnetPropertyType[BACnetPropertyType["propReplyTooSlowApplicationErr"] = 2890] = "propReplyTooSlowApplicationErr";
    BACnetPropertyType[BACnetPropertyType["propInternalErrors"] = 2891] = "propInternalErrors";
    BACnetPropertyType[BACnetPropertyType["propLostToken"] = 2892] = "propLostToken";
    BACnetPropertyType[BACnetPropertyType["propTokenLoopTime"] = 2893] = "propTokenLoopTime";
    BACnetPropertyType[BACnetPropertyType["propMaximumTokenLoopTime"] = 2894] = "propMaximumTokenLoopTime";
    BACnetPropertyType[BACnetPropertyType["propAccessLevel"] = 3003] = "propAccessLevel";
    BACnetPropertyType[BACnetPropertyType["propUpdateEwma"] = 3041] = "propUpdateEwma";
    BACnetPropertyType[BACnetPropertyType["propSetupType"] = 3042] = "propSetupType";
    BACnetPropertyType[BACnetPropertyType["propSmoothingConstant"] = 3046] = "propSmoothingConstant";
    BACnetPropertyType[BACnetPropertyType["propInputAPrevious"] = 3047] = "propInputAPrevious";
    BACnetPropertyType[BACnetPropertyType["propSupervisoryDeviceProcessId"] = 3052] = "propSupervisoryDeviceProcessId";
    BACnetPropertyType[BACnetPropertyType["propNumberOfDataRecords"] = 3053] = "propNumberOfDataRecords";
    BACnetPropertyType[BACnetPropertyType["propDataRecordDelete"] = 3058] = "propDataRecordDelete";
    BACnetPropertyType[BACnetPropertyType["propType"] = 3060] = "propType";
    BACnetPropertyType[BACnetPropertyType["propSubtype"] = 3071] = "propSubtype";
    BACnetPropertyType[BACnetPropertyType["propObject"] = 3080] = "propObject";
    BACnetPropertyType[BACnetPropertyType["propOccCoolingShift"] = 3093] = "propOccCoolingShift";
    BACnetPropertyType[BACnetPropertyType["propStandbyCoolingShift"] = 3094] = "propStandbyCoolingShift";
    BACnetPropertyType[BACnetPropertyType["propUnoccCoolingShift"] = 3095] = "propUnoccCoolingShift";
    BACnetPropertyType[BACnetPropertyType["propOccHeatingShift"] = 3096] = "propOccHeatingShift";
    BACnetPropertyType[BACnetPropertyType["propStandbyHeatingShift"] = 3097] = "propStandbyHeatingShift";
    BACnetPropertyType[BACnetPropertyType["propUnoccHeatingShift"] = 3098] = "propUnoccHeatingShift";
    BACnetPropertyType[BACnetPropertyType["propEffectiveHeatingSetpoint"] = 3100] = "propEffectiveHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propEffectiveCoolingSetpoint"] = 3101] = "propEffectiveCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propOccCoolingSetpoint"] = 3102] = "propOccCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propStandbyCoolingSetpoint"] = 3103] = "propStandbyCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propUnoccCoolingSetpoint"] = 3104] = "propUnoccCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propOccHeatingSetpoint"] = 3105] = "propOccHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propStandbyHeatingSetpoint"] = 3106] = "propStandbyHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propUnoccHeatingSetpoint"] = 3107] = "propUnoccHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propMaxCoolingSetpoint"] = 3108] = "propMaxCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propMinHeatingSetpoint"] = 3109] = "propMinHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propTemporaryOccupancy"] = 3110] = "propTemporaryOccupancy";
    BACnetPropertyType[BACnetPropertyType["propDefaultOccupancy"] = 3111] = "propDefaultOccupancy";
    BACnetPropertyType[BACnetPropertyType["propOccupancyOverride"] = 3112] = "propOccupancyOverride";
    BACnetPropertyType[BACnetPropertyType["propDefaultValue"] = 3113] = "propDefaultValue";
    BACnetPropertyType[BACnetPropertyType["propUseDefaultIfNotReliable"] = 3114] = "propUseDefaultIfNotReliable";
    BACnetPropertyType[BACnetPropertyType["propOutputPriority"] = 3115] = "propOutputPriority";
    BACnetPropertyType[BACnetPropertyType["propOutputReference"] = 3116] = "propOutputReference";
    BACnetPropertyType[BACnetPropertyType["propSeqOrder"] = 3117] = "propSeqOrder";
    BACnetPropertyType[BACnetPropertyType["propConnectionList"] = 3118] = "propConnectionList";
    BACnetPropertyType[BACnetPropertyType["propEffectiveCoolingShift"] = 3119] = "propEffectiveCoolingShift";
    BACnetPropertyType[BACnetPropertyType["propEffectiveHeatingShift"] = 3120] = "propEffectiveHeatingShift";
    BACnetPropertyType[BACnetPropertyType["propSyncState"] = 3121] = "propSyncState";
    BACnetPropertyType[BACnetPropertyType["propDefaultInput"] = 3122] = "propDefaultInput";
    BACnetPropertyType[BACnetPropertyType["propLightStatus"] = 3126] = "propLightStatus";
    BACnetPropertyType[BACnetPropertyType["propFeedbackProvided"] = 3127] = "propFeedbackProvided";
    BACnetPropertyType[BACnetPropertyType["propWarnOccupant"] = 3128] = "propWarnOccupant";
    BACnetPropertyType[BACnetPropertyType["propLightShutoffDelay"] = 3129] = "propLightShutoffDelay";
    BACnetPropertyType[BACnetPropertyType["propLightingOperatingState"] = 3130] = "propLightingOperatingState";
    BACnetPropertyType[BACnetPropertyType["propBypassTimerOutput"] = 3132] = "propBypassTimerOutput";
    BACnetPropertyType[BACnetPropertyType["propEmailDiagnostics"] = 3133] = "propEmailDiagnostics";
    BACnetPropertyType[BACnetPropertyType["propCancelTimer"] = 3134] = "propCancelTimer";
    BACnetPropertyType[BACnetPropertyType["propRunInFirstGroup"] = 3135] = "propRunInFirstGroup";
    BACnetPropertyType[BACnetPropertyType["propNumberOfInputAttributes"] = 3136] = "propNumberOfInputAttributes";
    BACnetPropertyType[BACnetPropertyType["propNumberOfOutputAttributes"] = 3137] = "propNumberOfOutputAttributes";
    BACnetPropertyType[BACnetPropertyType["propMapTableAttribute"] = 3138] = "propMapTableAttribute";
    BACnetPropertyType[BACnetPropertyType["propStateBlocks"] = 3162] = "propStateBlocks";
    BACnetPropertyType[BACnetPropertyType["propProcessRange"] = 3163] = "propProcessRange";
    BACnetPropertyType[BACnetPropertyType["propTimeConstant"] = 3164] = "propTimeConstant";
    BACnetPropertyType[BACnetPropertyType["propMinimumTuneBand"] = 3166] = "propMinimumTuneBand";
    BACnetPropertyType[BACnetPropertyType["propPracStatus"] = 3167] = "propPracStatus";
    BACnetPropertyType[BACnetPropertyType["propAbsoluteEffortEwma"] = 3168] = "propAbsoluteEffortEwma";
    BACnetPropertyType[BACnetPropertyType["propAbsoluteErrorEwma"] = 3169] = "propAbsoluteErrorEwma";
    BACnetPropertyType[BACnetPropertyType["propErrorEwma"] = 3170] = "propErrorEwma";
    BACnetPropertyType[BACnetPropertyType["propPresentValueEwma"] = 3171] = "propPresentValueEwma";
    BACnetPropertyType[BACnetPropertyType["propAdaptiveTuning"] = 3173] = "propAdaptiveTuning";
    BACnetPropertyType[BACnetPropertyType["propAverageIdleTime"] = 3175] = "propAverageIdleTime";
    BACnetPropertyType[BACnetPropertyType["propAverageExecutingTime"] = 3176] = "propAverageExecutingTime";
    BACnetPropertyType[BACnetPropertyType["propAverageExecutionFrequency"] = 3177] = "propAverageExecutionFrequency";
    BACnetPropertyType[BACnetPropertyType["propAverageExecutionDelay"] = 3178] = "propAverageExecutionDelay";
    BACnetPropertyType[BACnetPropertyType["propAverageExecutionDuration"] = 3179] = "propAverageExecutionDuration";
    BACnetPropertyType[BACnetPropertyType["propAverageSliceCount"] = 3180] = "propAverageSliceCount";
    BACnetPropertyType[BACnetPropertyType["propAverageSlicedDuration"] = 3181] = "propAverageSlicedDuration";
    BACnetPropertyType[BACnetPropertyType["propExposedPortsList"] = 3184] = "propExposedPortsList";
    BACnetPropertyType[BACnetPropertyType["propActiveRow"] = 3185] = "propActiveRow";
    BACnetPropertyType[BACnetPropertyType["propSimpleStateArray"] = 3186] = "propSimpleStateArray";
    BACnetPropertyType[BACnetPropertyType["propStateTransitionTable"] = 3188] = "propStateTransitionTable";
    BACnetPropertyType[BACnetPropertyType["propTransitionExpressionArray"] = 3189] = "propTransitionExpressionArray";
    BACnetPropertyType[BACnetPropertyType["propActiveState"] = 3190] = "propActiveState";
    BACnetPropertyType[BACnetPropertyType["propTimeInState"] = 3191] = "propTimeInState";
    BACnetPropertyType[BACnetPropertyType["propTransitionTime"] = 3193] = "propTransitionTime";
    BACnetPropertyType[BACnetPropertyType["propTransitionNumber"] = 3194] = "propTransitionNumber";
    BACnetPropertyType[BACnetPropertyType["propReferenceSignature"] = 3196] = "propReferenceSignature";
    BACnetPropertyType[BACnetPropertyType["propTransitionSummary"] = 3197] = "propTransitionSummary";
    BACnetPropertyType[BACnetPropertyType["propInput3"] = 3199] = "propInput3";
    BACnetPropertyType[BACnetPropertyType["propInput4"] = 3200] = "propInput4";
    BACnetPropertyType[BACnetPropertyType["propInput5"] = 3201] = "propInput5";
    BACnetPropertyType[BACnetPropertyType["propInput6"] = 3202] = "propInput6";
    BACnetPropertyType[BACnetPropertyType["propInput7"] = 3203] = "propInput7";
    BACnetPropertyType[BACnetPropertyType["propInput8"] = 3204] = "propInput8";
    BACnetPropertyType[BACnetPropertyType["propInterval"] = 3301] = "propInterval";
    BACnetPropertyType[BACnetPropertyType["propInputInformationArray"] = 3304] = "propInputInformationArray";
    BACnetPropertyType[BACnetPropertyType["propOperatingMode"] = 3329] = "propOperatingMode";
    BACnetPropertyType[BACnetPropertyType["propVernierOut"] = 3330] = "propVernierOut";
    BACnetPropertyType[BACnetPropertyType["propNumberOfSegments"] = 3331] = "propNumberOfSegments";
    BACnetPropertyType[BACnetPropertyType["propInputPoints"] = 3332] = "propInputPoints";
    BACnetPropertyType[BACnetPropertyType["propOutputPoints"] = 3333] = "propOutputPoints";
    BACnetPropertyType[BACnetPropertyType["propClampFirst"] = 3334] = "propClampFirst";
    BACnetPropertyType[BACnetPropertyType["propClampLast"] = 3335] = "propClampLast";
    BACnetPropertyType[BACnetPropertyType["propActiveSegment"] = 3336] = "propActiveSegment";
    BACnetPropertyType[BACnetPropertyType["propN2HwCount"] = 3337] = "propN2HwCount";
    BACnetPropertyType[BACnetPropertyType["propN2SwCount"] = 3338] = "propN2SwCount";
    BACnetPropertyType[BACnetPropertyType["propN2PsCount"] = 3339] = "propN2PsCount";
    BACnetPropertyType[BACnetPropertyType["propProcessCount"] = 3340] = "propProcessCount";
    BACnetPropertyType[BACnetPropertyType["propDllrCount"] = 3341] = "propDllrCount";
    BACnetPropertyType[BACnetPropertyType["propArchiveGateNumber"] = 3342] = "propArchiveGateNumber";
    BACnetPropertyType[BACnetPropertyType["propArchiveDeviceType"] = 3343] = "propArchiveDeviceType";
    BACnetPropertyType[BACnetPropertyType["propArchiveNodeNumber"] = 3344] = "propArchiveNodeNumber";
    BACnetPropertyType[BACnetPropertyType["propRebootOnError"] = 3345] = "propRebootOnError";
    BACnetPropertyType[BACnetPropertyType["propArcnetHwTimeout"] = 3346] = "propArcnetHwTimeout";
    BACnetPropertyType[BACnetPropertyType["propArchiveIpAddress"] = 3347] = "propArchiveIpAddress";
    BACnetPropertyType[BACnetPropertyType["propBroadcastType"] = 3348] = "propBroadcastType";
    BACnetPropertyType[BACnetPropertyType["propTrunk_1Type"] = 3349] = "propTrunk_1Type";
    BACnetPropertyType[BACnetPropertyType["propTrunk_2Type"] = 3350] = "propTrunk_2Type";
    BACnetPropertyType[BACnetPropertyType["propNcmStatus"] = 3351] = "propNcmStatus";
    BACnetPropertyType[BACnetPropertyType["propRuntimeDays"] = 3352] = "propRuntimeDays";
    BACnetPropertyType[BACnetPropertyType["propP2Errors"] = 3353] = "propP2Errors";
    BACnetPropertyType[BACnetPropertyType["propP3Errors"] = 3354] = "propP3Errors";
    BACnetPropertyType[BACnetPropertyType["propP5Errors"] = 3355] = "propP5Errors";
    BACnetPropertyType[BACnetPropertyType["propP6Errors"] = 3356] = "propP6Errors";
    BACnetPropertyType[BACnetPropertyType["propT1PollError"] = 3357] = "propT1PollError";
    BACnetPropertyType[BACnetPropertyType["propT1CommandError"] = 3358] = "propT1CommandError";
    BACnetPropertyType[BACnetPropertyType["propT2PollError"] = 3359] = "propT2PollError";
    BACnetPropertyType[BACnetPropertyType["propT2CommandError"] = 3360] = "propT2CommandError";
    BACnetPropertyType[BACnetPropertyType["propNetworkErrors"] = 3361] = "propNetworkErrors";
    BACnetPropertyType[BACnetPropertyType["propLastReliableCommandSignatur"] = 3362] = "propLastReliableCommandSignatur";
    BACnetPropertyType[BACnetPropertyType["propAttributeId"] = 3365] = "propAttributeId";
    BACnetPropertyType[BACnetPropertyType["propCommandSignature"] = 3366] = "propCommandSignature";
    BACnetPropertyType[BACnetPropertyType["propHybridActivityCommandSignat"] = 3367] = "propHybridActivityCommandSignat";
    BACnetPropertyType[BACnetPropertyType["propInTest"] = 3368] = "propInTest";
    BACnetPropertyType[BACnetPropertyType["propLastReliableValue"] = 3369] = "propLastReliableValue";
    BACnetPropertyType[BACnetPropertyType["propTestValue"] = 3371] = "propTestValue";
    BACnetPropertyType[BACnetPropertyType["propUserModified"] = 3373] = "propUserModified";
    BACnetPropertyType[BACnetPropertyType["propCommissioningUser"] = 3374] = "propCommissioningUser";
    BACnetPropertyType[BACnetPropertyType["propBlockList"] = 3375] = "propBlockList";
    BACnetPropertyType[BACnetPropertyType["propCurrentValue"] = 3376] = "propCurrentValue";
    BACnetPropertyType[BACnetPropertyType["propCurrentReliability"] = 3377] = "propCurrentReliability";
    BACnetPropertyType[BACnetPropertyType["propCurrentCommandSignature"] = 3378] = "propCurrentCommandSignature";
    BACnetPropertyType[BACnetPropertyType["propExecutionRunCount"] = 3379] = "propExecutionRunCount";
    BACnetPropertyType[BACnetPropertyType["propMaxFileSize"] = 3380] = "propMaxFileSize";
    BACnetPropertyType[BACnetPropertyType["propIncludeStateStatus"] = 3382] = "propIncludeStateStatus";
    BACnetPropertyType[BACnetPropertyType["propBlockPositionList"] = 3383] = "propBlockPositionList";
    BACnetPropertyType[BACnetPropertyType["propContinuationList"] = 3384] = "propContinuationList";
    BACnetPropertyType[BACnetPropertyType["propTransferSize"] = 3388] = "propTransferSize";
    BACnetPropertyType[BACnetPropertyType["propPollFrequency"] = 3389] = "propPollFrequency";
    BACnetPropertyType[BACnetPropertyType["propFcWaitBeforePolling"] = 3391] = "propFcWaitBeforePolling";
    BACnetPropertyType[BACnetPropertyType["propMainCodeVersion"] = 3393] = "propMainCodeVersion";
    BACnetPropertyType[BACnetPropertyType["propMinChangeToSend"] = 3398] = "propMinChangeToSend";
    BACnetPropertyType[BACnetPropertyType["propSourceReferences"] = 3399] = "propSourceReferences";
    BACnetPropertyType[BACnetPropertyType["propCaptureChanges"] = 3400] = "propCaptureChanges";
    BACnetPropertyType[BACnetPropertyType["propTestSession"] = 3401] = "propTestSession";
    BACnetPropertyType[BACnetPropertyType["propOverrideCommandValue"] = 3404] = "propOverrideCommandValue";
    BACnetPropertyType[BACnetPropertyType["propTransitionExpressions"] = 3405] = "propTransitionExpressions";
    BACnetPropertyType[BACnetPropertyType["propMaxOutputQueue"] = 3406] = "propMaxOutputQueue";
    BACnetPropertyType[BACnetPropertyType["propFilterSetup"] = 3407] = "propFilterSetup";
    BACnetPropertyType[BACnetPropertyType["propManualTuning"] = 3408] = "propManualTuning";
    BACnetPropertyType[BACnetPropertyType["propEffMinTuneBand"] = 3410] = "propEffMinTuneBand";
    BACnetPropertyType[BACnetPropertyType["propSetpointDifferential"] = 3411] = "propSetpointDifferential";
    BACnetPropertyType[BACnetPropertyType["propTuningUpdated"] = 3413] = "propTuningUpdated";
    BACnetPropertyType[BACnetPropertyType["propPracPropBand"] = 3414] = "propPracPropBand";
    BACnetPropertyType[BACnetPropertyType["propPracIntegralTime"] = 3415] = "propPracIntegralTime";
    BACnetPropertyType[BACnetPropertyType["propEffDerivativeTime"] = 3418] = "propEffDerivativeTime";
    BACnetPropertyType[BACnetPropertyType["propEffSaturationTime"] = 3419] = "propEffSaturationTime";
    BACnetPropertyType[BACnetPropertyType["propEffPeriod"] = 3420] = "propEffPeriod";
    BACnetPropertyType[BACnetPropertyType["propProcessDeadTime"] = 3421] = "propProcessDeadTime";
    BACnetPropertyType[BACnetPropertyType["propProcessId"] = 3422] = "propProcessId";
    BACnetPropertyType[BACnetPropertyType["propEffProportionalBand"] = 3424] = "propEffProportionalBand";
    BACnetPropertyType[BACnetPropertyType["propEffIntegralTime"] = 3425] = "propEffIntegralTime";
    BACnetPropertyType[BACnetPropertyType["propMaxDataLife"] = 3428] = "propMaxDataLife";
    BACnetPropertyType[BACnetPropertyType["propOnPulse"] = 3429] = "propOnPulse";
    BACnetPropertyType[BACnetPropertyType["propOffPulse"] = 3430] = "propOffPulse";
    BACnetPropertyType[BACnetPropertyType["propInternalUnits"] = 3432] = "propInternalUnits";
    BACnetPropertyType[BACnetPropertyType["propEffDeadband"] = 3433] = "propEffDeadband";
    BACnetPropertyType[BACnetPropertyType["propStagedOutput"] = 3434] = "propStagedOutput";
    BACnetPropertyType[BACnetPropertyType["propControlBand"] = 3435] = "propControlBand";
    BACnetPropertyType[BACnetPropertyType["propDewPointTemperature"] = 3437] = "propDewPointTemperature";
    BACnetPropertyType[BACnetPropertyType["propEffMinOnTime"] = 3438] = "propEffMinOnTime";
    BACnetPropertyType[BACnetPropertyType["propEffMinOffTime"] = 3439] = "propEffMinOffTime";
    BACnetPropertyType[BACnetPropertyType["propEffTimeConstant"] = 3440] = "propEffTimeConstant";
    BACnetPropertyType[BACnetPropertyType["propMinPeriod"] = 3442] = "propMinPeriod";
    BACnetPropertyType[BACnetPropertyType["propInvertStage"] = 3443] = "propInvertStage";
    BACnetPropertyType[BACnetPropertyType["propStagingHysterisis"] = 3444] = "propStagingHysterisis";
    BACnetPropertyType[BACnetPropertyType["propNumberOfDevices"] = 3446] = "propNumberOfDevices";
    BACnetPropertyType[BACnetPropertyType["propRequestedCapacity"] = 3447] = "propRequestedCapacity";
    BACnetPropertyType[BACnetPropertyType["propOnCapacity"] = 3448] = "propOnCapacity";
    BACnetPropertyType[BACnetPropertyType["propCapacityList"] = 3449] = "propCapacityList";
    BACnetPropertyType[BACnetPropertyType["propDesiredOutputs"] = 3450] = "propDesiredOutputs";
    BACnetPropertyType[BACnetPropertyType["propTimerStatus"] = 3451] = "propTimerStatus";
    BACnetPropertyType[BACnetPropertyType["propEnthalpy"] = 3453] = "propEnthalpy";
    BACnetPropertyType[BACnetPropertyType["propBypassPercent"] = 3454] = "propBypassPercent";
    BACnetPropertyType[BACnetPropertyType["propChangeOverTemperature"] = 3455] = "propChangeOverTemperature";
    BACnetPropertyType[BACnetPropertyType["propCoolingDischargeTemperature"] = 3456] = "propCoolingDischargeTemperature";
    BACnetPropertyType[BACnetPropertyType["propFreeCoolingAvailable"] = 3457] = "propFreeCoolingAvailable";
    BACnetPropertyType[BACnetPropertyType["propMinOaPercent"] = 3458] = "propMinOaPercent";
    BACnetPropertyType[BACnetPropertyType["propSupplyFanStatus"] = 3460] = "propSupplyFanStatus";
    BACnetPropertyType[BACnetPropertyType["propStateConnections"] = 3461] = "propStateConnections";
    BACnetPropertyType[BACnetPropertyType["propStandardTuning"] = 3462] = "propStandardTuning";
    BACnetPropertyType[BACnetPropertyType["propEffProcessRange"] = 3463] = "propEffProcessRange";
    BACnetPropertyType[BACnetPropertyType["propEffProcessDeadTime"] = 3464] = "propEffProcessDeadTime";
    BACnetPropertyType[BACnetPropertyType["propOutputResolution"] = 3465] = "propOutputResolution";
    BACnetPropertyType[BACnetPropertyType["propActiveStageCount"] = 3467] = "propActiveStageCount";
    BACnetPropertyType[BACnetPropertyType["propEconomizerType"] = 3472] = "propEconomizerType";
    BACnetPropertyType[BACnetPropertyType["propOutsideAirTemp"] = 3473] = "propOutsideAirTemp";
    BACnetPropertyType[BACnetPropertyType["propOutsideAirHumidity"] = 3474] = "propOutsideAirHumidity";
    BACnetPropertyType[BACnetPropertyType["propReturnAirHumidity"] = 3475] = "propReturnAirHumidity";
    BACnetPropertyType[BACnetPropertyType["propFlow"] = 3476] = "propFlow";
    BACnetPropertyType[BACnetPropertyType["propMaximumFlow"] = 3477] = "propMaximumFlow";
    BACnetPropertyType[BACnetPropertyType["propEffectiveStrokeTime"] = 3478] = "propEffectiveStrokeTime";
    BACnetPropertyType[BACnetPropertyType["propSmoothFactor"] = 3479] = "propSmoothFactor";
    BACnetPropertyType[BACnetPropertyType["propLowLoadDelay"] = 3480] = "propLowLoadDelay";
    BACnetPropertyType[BACnetPropertyType["propTotalFileSize"] = 3485] = "propTotalFileSize";
    BACnetPropertyType[BACnetPropertyType["propLoadType"] = 3486] = "propLoadType";
    BACnetPropertyType[BACnetPropertyType["propMaxStatusReads"] = 3487] = "propMaxStatusReads";
    BACnetPropertyType[BACnetPropertyType["propBytesSentToController"] = 3488] = "propBytesSentToController";
    BACnetPropertyType[BACnetPropertyType["propNextBlockExpected"] = 3489] = "propNextBlockExpected";
    BACnetPropertyType[BACnetPropertyType["propOperationStatusCode"] = 3490] = "propOperationStatusCode";
    BACnetPropertyType[BACnetPropertyType["propOperationErrorCode"] = 3491] = "propOperationErrorCode";
    BACnetPropertyType[BACnetPropertyType["propBytesRemainingInBuffer"] = 3492] = "propBytesRemainingInBuffer";
    BACnetPropertyType[BACnetPropertyType["propBytesRemainingInFile"] = 3493] = "propBytesRemainingInFile";
    BACnetPropertyType[BACnetPropertyType["propBuffer1"] = 3494] = "propBuffer1";
    BACnetPropertyType[BACnetPropertyType["propBuffer2"] = 3495] = "propBuffer2";
    BACnetPropertyType[BACnetPropertyType["propActiveBufferPointer"] = 3496] = "propActiveBufferPointer";
    BACnetPropertyType[BACnetPropertyType["propFilePointer"] = 3497] = "propFilePointer";
    BACnetPropertyType[BACnetPropertyType["propBytesToSend"] = 3498] = "propBytesToSend";
    BACnetPropertyType[BACnetPropertyType["propBytesCopiedToBuffer1"] = 3499] = "propBytesCopiedToBuffer1";
    BACnetPropertyType[BACnetPropertyType["propBytesCopiedToBuffer2"] = 3500] = "propBytesCopiedToBuffer2";
    BACnetPropertyType[BACnetPropertyType["propBuffer1Status"] = 3501] = "propBuffer1Status";
    BACnetPropertyType[BACnetPropertyType["propBuffer2Status"] = 3502] = "propBuffer2Status";
    BACnetPropertyType[BACnetPropertyType["propUnitSet"] = 3503] = "propUnitSet";
    BACnetPropertyType[BACnetPropertyType["propDifferentialPressure"] = 3504] = "propDifferentialPressure";
    BACnetPropertyType[BACnetPropertyType["propAirflowRate"] = 3505] = "propAirflowRate";
    BACnetPropertyType[BACnetPropertyType["propAutocalibrateOffset"] = 3506] = "propAutocalibrateOffset";
    BACnetPropertyType[BACnetPropertyType["propWetBulbTemperature"] = 3507] = "propWetBulbTemperature";
    BACnetPropertyType[BACnetPropertyType["propAbsoluteHumidity"] = 3508] = "propAbsoluteHumidity";
    BACnetPropertyType[BACnetPropertyType["propPredictedTokenLoopTime"] = 3509] = "propPredictedTokenLoopTime";
    BACnetPropertyType[BACnetPropertyType["propTemporaryStatusItemExpirati"] = 3510] = "propTemporaryStatusItemExpirati";
    BACnetPropertyType[BACnetPropertyType["propStatusLaunchInterval"] = 3511] = "propStatusLaunchInterval";
    BACnetPropertyType[BACnetPropertyType["propPriority_1PollItems"] = 3512] = "propPriority_1PollItems";
    BACnetPropertyType[BACnetPropertyType["propPriority_2PollItems"] = 3513] = "propPriority_2PollItems";
    BACnetPropertyType[BACnetPropertyType["propPriority_3PollItems"] = 3514] = "propPriority_3PollItems";
    BACnetPropertyType[BACnetPropertyType["propPriority_1PollTime"] = 3515] = "propPriority_1PollTime";
    BACnetPropertyType[BACnetPropertyType["propPriority_2PollTime"] = 3516] = "propPriority_2PollTime";
    BACnetPropertyType[BACnetPropertyType["propPriority_3PollTime"] = 3517] = "propPriority_3PollTime";
    BACnetPropertyType[BACnetPropertyType["propStatusCacheHits"] = 3518] = "propStatusCacheHits";
    BACnetPropertyType[BACnetPropertyType["propStatusCacheMisses"] = 3519] = "propStatusCacheMisses";
    BACnetPropertyType[BACnetPropertyType["propTemporaryStatusItemCount"] = 3520] = "propTemporaryStatusItemCount";
    BACnetPropertyType[BACnetPropertyType["propPermanentStatusItemCount"] = 3521] = "propPermanentStatusItemCount";
    BACnetPropertyType[BACnetPropertyType["propDeviceOfflinePollingCycleT"] = 3522] = "propDeviceOfflinePollingCycleT";
    BACnetPropertyType[BACnetPropertyType["propDeviceOnlinePollingCycleTi"] = 3523] = "propDeviceOnlinePollingCycleTi";
    BACnetPropertyType[BACnetPropertyType["propLonIntegrationDllTime"] = 3524] = "propLonIntegrationDllTime";
    BACnetPropertyType[BACnetPropertyType["propLonIntegrationDllDate"] = 3525] = "propLonIntegrationDllDate";
    BACnetPropertyType[BACnetPropertyType["propLonIntegrationDllSize"] = 3526] = "propLonIntegrationDllSize";
    BACnetPropertyType[BACnetPropertyType["propMessageRetryCount"] = 3527] = "propMessageRetryCount";
    BACnetPropertyType[BACnetPropertyType["propTotalMessagesToDevice"] = 3528] = "propTotalMessagesToDevice";
    BACnetPropertyType[BACnetPropertyType["propTotalSingleMessageFailures"] = 3529] = "propTotalSingleMessageFailures";
    BACnetPropertyType[BACnetPropertyType["propNumberOfOfflinePolls"] = 3530] = "propNumberOfOfflinePolls";
    BACnetPropertyType[BACnetPropertyType["propEnablePolling"] = 3531] = "propEnablePolling";
    BACnetPropertyType[BACnetPropertyType["propCommandStatusMappingTable"] = 3532] = "propCommandStatusMappingTable";
    BACnetPropertyType[BACnetPropertyType["propNetworkSetpoint"] = 3533] = "propNetworkSetpoint";
    BACnetPropertyType[BACnetPropertyType["propHardwareSetpoint"] = 3534] = "propHardwareSetpoint";
    BACnetPropertyType[BACnetPropertyType["propHardwareSetpointOffset"] = 3535] = "propHardwareSetpointOffset";
    BACnetPropertyType[BACnetPropertyType["propEffOccCoolingSetpoint"] = 3536] = "propEffOccCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propEffOccHeatingSetpoint"] = 3537] = "propEffOccHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propRemoteSetpointMode"] = 3538] = "propRemoteSetpointMode";
    BACnetPropertyType[BACnetPropertyType["propOstWarmupState"] = 3539] = "propOstWarmupState";
    BACnetPropertyType[BACnetPropertyType["propOstCooldownState"] = 3540] = "propOstCooldownState";
    BACnetPropertyType[BACnetPropertyType["propOstCoastState"] = 3541] = "propOstCoastState";
    BACnetPropertyType[BACnetPropertyType["propLowpassFilterEnable"] = 3542] = "propLowpassFilterEnable";
    BACnetPropertyType[BACnetPropertyType["propMinus_20DbFrequency"] = 3543] = "propMinus_20DbFrequency";
    BACnetPropertyType[BACnetPropertyType["propEndpointTolerance"] = 3544] = "propEndpointTolerance";
    BACnetPropertyType[BACnetPropertyType["propHardwarePeriod"] = 3545] = "propHardwarePeriod";
    BACnetPropertyType[BACnetPropertyType["propProcessTimeConstant"] = 3549] = "propProcessTimeConstant";
    BACnetPropertyType[BACnetPropertyType["propPmacPeriod"] = 3550] = "propPmacPeriod";
    BACnetPropertyType[BACnetPropertyType["propPercentRequestMode"] = 3551] = "propPercentRequestMode";
    BACnetPropertyType[BACnetPropertyType["propPercentCapacityEnabled"] = 3552] = "propPercentCapacityEnabled";
    BACnetPropertyType[BACnetPropertyType["propPercentRequest"] = 3553] = "propPercentRequest";
    BACnetPropertyType[BACnetPropertyType["propMaxCapacityFraction"] = 3554] = "propMaxCapacityFraction";
    BACnetPropertyType[BACnetPropertyType["propMinPercentRequest"] = 3555] = "propMinPercentRequest";
    BACnetPropertyType[BACnetPropertyType["propDeviceCapacity"] = 3556] = "propDeviceCapacity";
    BACnetPropertyType[BACnetPropertyType["propDevicePulseable"] = 3557] = "propDevicePulseable";
    BACnetPropertyType[BACnetPropertyType["propDeviceFirstOf"] = 3558] = "propDeviceFirstOf";
    BACnetPropertyType[BACnetPropertyType["propDeadzone"] = 3559] = "propDeadzone";
    BACnetPropertyType[BACnetPropertyType["propPulsedDevice"] = 3560] = "propPulsedDevice";
    BACnetPropertyType[BACnetPropertyType["propObjectToStartMsgTiming"] = 3561] = "propObjectToStartMsgTiming";
    BACnetPropertyType[BACnetPropertyType["propPmacExecutions"] = 3562] = "propPmacExecutions";
    BACnetPropertyType[BACnetPropertyType["propBatteryCharging"] = 3563] = "propBatteryCharging";
    BACnetPropertyType[BACnetPropertyType["propRoutingEnabled"] = 3567] = "propRoutingEnabled";
    BACnetPropertyType[BACnetPropertyType["propTrimming"] = 3568] = "propTrimming";
    BACnetPropertyType[BACnetPropertyType["propTrimPercent"] = 3569] = "propTrimPercent";
    BACnetPropertyType[BACnetPropertyType["propMinimumTrimCount"] = 3570] = "propMinimumTrimCount";
    BACnetPropertyType[BACnetPropertyType["propAverage"] = 3571] = "propAverage";
    BACnetPropertyType[BACnetPropertyType["propMedian"] = 3572] = "propMedian";
    BACnetPropertyType[BACnetPropertyType["propStandardDeviation"] = 3573] = "propStandardDeviation";
    BACnetPropertyType[BACnetPropertyType["propLimitActive"] = 3574] = "propLimitActive";
    BACnetPropertyType[BACnetPropertyType["propOperatingState"] = 3577] = "propOperatingState";
    BACnetPropertyType[BACnetPropertyType["propSourceMaxValues"] = 3579] = "propSourceMaxValues";
    BACnetPropertyType[BACnetPropertyType["propInterstageTiming"] = 3580] = "propInterstageTiming";
    BACnetPropertyType[BACnetPropertyType["propRolloverAmount"] = 3582] = "propRolloverAmount";
    BACnetPropertyType[BACnetPropertyType["propReferenceState"] = 3583] = "propReferenceState";
    BACnetPropertyType[BACnetPropertyType["propRolloverMode"] = 3584] = "propRolloverMode";
    BACnetPropertyType[BACnetPropertyType["propErrorSinceLastReset"] = 3585] = "propErrorSinceLastReset";
    BACnetPropertyType[BACnetPropertyType["propStoredPresentValue"] = 3586] = "propStoredPresentValue";
    BACnetPropertyType[BACnetPropertyType["propStoredAccumulator"] = 3587] = "propStoredAccumulator";
    BACnetPropertyType[BACnetPropertyType["propStoredRolloverAmount"] = 3588] = "propStoredRolloverAmount";
    BACnetPropertyType[BACnetPropertyType["propStoredRolloverCount"] = 3589] = "propStoredRolloverCount";
    BACnetPropertyType[BACnetPropertyType["propStartupId"] = 3590] = "propStartupId";
    BACnetPropertyType[BACnetPropertyType["propText"] = 3591] = "propText";
    BACnetPropertyType[BACnetPropertyType["propDeviceEnable"] = 3608] = "propDeviceEnable";
    BACnetPropertyType[BACnetPropertyType["propStart"] = 3611] = "propStart";
    BACnetPropertyType[BACnetPropertyType["propTemperatureDisplay"] = 3617] = "propTemperatureDisplay";
    BACnetPropertyType[BACnetPropertyType["propFanStatusDisplay"] = 3618] = "propFanStatusDisplay";
    BACnetPropertyType[BACnetPropertyType["propOccupancyStatusDisplay"] = 3619] = "propOccupancyStatusDisplay";
    BACnetPropertyType[BACnetPropertyType["propTestMode"] = 3620] = "propTestMode";
    BACnetPropertyType[BACnetPropertyType["propIrrelevantCount"] = 3627] = "propIrrelevantCount";
    BACnetPropertyType[BACnetPropertyType["propFcBusMacAddress"] = 3629] = "propFcBusMacAddress";
    BACnetPropertyType[BACnetPropertyType["propInputsInControl"] = 3630] = "propInputsInControl";
    BACnetPropertyType[BACnetPropertyType["propEffectiveDuration"] = 3631] = "propEffectiveDuration";
    BACnetPropertyType[BACnetPropertyType["propRevision"] = 3632] = "propRevision";
    BACnetPropertyType[BACnetPropertyType["propDefaultAttributeValue"] = 3633] = "propDefaultAttributeValue";
    BACnetPropertyType[BACnetPropertyType["propDefaultElement"] = 3634] = "propDefaultElement";
    BACnetPropertyType[BACnetPropertyType["propNotifyPriority"] = 3644] = "propNotifyPriority";
    BACnetPropertyType[BACnetPropertyType["propSaBusMacAddress"] = 3645] = "propSaBusMacAddress";
    BACnetPropertyType[BACnetPropertyType["propTrendMemoryUsage"] = 3646] = "propTrendMemoryUsage";
    BACnetPropertyType[BACnetPropertyType["propControlSequenceInTest"] = 3651] = "propControlSequenceInTest";
    BACnetPropertyType[BACnetPropertyType["propSupervisorDeviceOnline"] = 3653] = "propSupervisorDeviceOnline";
    BACnetPropertyType[BACnetPropertyType["propAutocalibrateNow"] = 3654] = "propAutocalibrateNow";
    BACnetPropertyType[BACnetPropertyType["propPercentDpOffset"] = 3655] = "propPercentDpOffset";
    BACnetPropertyType[BACnetPropertyType["propFullRangeDp"] = 3656] = "propFullRangeDp";
    BACnetPropertyType[BACnetPropertyType["propEffectiveDp"] = 3657] = "propEffectiveDp";
    BACnetPropertyType[BACnetPropertyType["propRatedBoxFlow"] = 3661] = "propRatedBoxFlow";
    BACnetPropertyType[BACnetPropertyType["propEffStrokeTime"] = 3662] = "propEffStrokeTime";
    BACnetPropertyType[BACnetPropertyType["propDamperPercentCmd"] = 3663] = "propDamperPercentCmd";
    BACnetPropertyType[BACnetPropertyType["propStepPosition"] = 3664] = "propStepPosition";
    BACnetPropertyType[BACnetPropertyType["propFlowTolerance"] = 3665] = "propFlowTolerance";
    BACnetPropertyType[BACnetPropertyType["propDpOffsetTolerance"] = 3666] = "propDpOffsetTolerance";
    BACnetPropertyType[BACnetPropertyType["propTestStep"] = 3667] = "propTestStep";
    BACnetPropertyType[BACnetPropertyType["propErrorSummary"] = 3668] = "propErrorSummary";
    BACnetPropertyType[BACnetPropertyType["propFlowData"] = 3669] = "propFlowData";
    BACnetPropertyType[BACnetPropertyType["propStandardName"] = 3670] = "propStandardName";
    BACnetPropertyType[BACnetPropertyType["propStandardVersion"] = 3671] = "propStandardVersion";
    BACnetPropertyType[BACnetPropertyType["propDestinationReferences"] = 3672] = "propDestinationReferences";
    BACnetPropertyType[BACnetPropertyType["propWinterGain"] = 3673] = "propWinterGain";
    BACnetPropertyType[BACnetPropertyType["propSummerGain"] = 3674] = "propSummerGain";
    BACnetPropertyType[BACnetPropertyType["propRequestedVendorId"] = 3675] = "propRequestedVendorId";
    BACnetPropertyType[BACnetPropertyType["propRequestedModelName"] = 3676] = "propRequestedModelName";
    BACnetPropertyType[BACnetPropertyType["propInputIsReliable"] = 3677] = "propInputIsReliable";
    BACnetPropertyType[BACnetPropertyType["propSetTime"] = 3684] = "propSetTime";
    BACnetPropertyType[BACnetPropertyType["propCalibration"] = 3719] = "propCalibration";
    BACnetPropertyType[BACnetPropertyType["propBacnetExposed"] = 3807] = "propBacnetExposed";
    BACnetPropertyType[BACnetPropertyType["propValue"] = 3809] = "propValue";
    BACnetPropertyType[BACnetPropertyType["propUseTrigger"] = 3810] = "propUseTrigger";
    BACnetPropertyType[BACnetPropertyType["propTestTrigger"] = 3811] = "propTestTrigger";
    BACnetPropertyType[BACnetPropertyType["propReliabilityValue"] = 3812] = "propReliabilityValue";
    BACnetPropertyType[BACnetPropertyType["propMultipleCovEnabled"] = 3813] = "propMultipleCovEnabled";
    BACnetPropertyType[BACnetPropertyType["propAuthenticationType"] = 3814] = "propAuthenticationType";
    BACnetPropertyType[BACnetPropertyType["propSmtpUserName"] = 3815] = "propSmtpUserName";
    BACnetPropertyType[BACnetPropertyType["propSmtpPassword"] = 3816] = "propSmtpPassword";
    BACnetPropertyType[BACnetPropertyType["propSetpointRequest"] = 3817] = "propSetpointRequest";
    BACnetPropertyType[BACnetPropertyType["propOccupancyRequest"] = 3818] = "propOccupancyRequest";
    BACnetPropertyType[BACnetPropertyType["propFanSpeedRequest"] = 3819] = "propFanSpeedRequest";
    BACnetPropertyType[BACnetPropertyType["propHardwareUpdateEnabled"] = 3820] = "propHardwareUpdateEnabled";
    BACnetPropertyType[BACnetPropertyType["propHpPointScanTime"] = 3823] = "propHpPointScanTime";
    BACnetPropertyType[BACnetPropertyType["propLpPointScanTime"] = 3824] = "propLpPointScanTime";
    BACnetPropertyType[BACnetPropertyType["propRfQuality"] = 3825] = "propRfQuality";
    BACnetPropertyType[BACnetPropertyType["propTxRecordCount"] = 3847] = "propTxRecordCount";
    BACnetPropertyType[BACnetPropertyType["propRcvRecordCount"] = 3848] = "propRcvRecordCount";
    BACnetPropertyType[BACnetPropertyType["propTxMessagesDiscarded"] = 3849] = "propTxMessagesDiscarded";
    BACnetPropertyType[BACnetPropertyType["propRcvMessagesDiscarded"] = 3850] = "propRcvMessagesDiscarded";
    BACnetPropertyType[BACnetPropertyType["propMaxOutputQueueUsed"] = 3851] = "propMaxOutputQueueUsed";
    BACnetPropertyType[BACnetPropertyType["propAllocatedRecordCount"] = 3852] = "propAllocatedRecordCount";
    BACnetPropertyType[BACnetPropertyType["propPendingQueueCount"] = 3853] = "propPendingQueueCount";
    BACnetPropertyType[BACnetPropertyType["propPeakPendingQueueCount"] = 3854] = "propPeakPendingQueueCount";
    BACnetPropertyType[BACnetPropertyType["propUnknownQueueCount"] = 3855] = "propUnknownQueueCount";
    BACnetPropertyType[BACnetPropertyType["propPeakUnknownQueueCount"] = 3856] = "propPeakUnknownQueueCount";
    BACnetPropertyType[BACnetPropertyType["propRcvMessageRate"] = 3857] = "propRcvMessageRate";
    BACnetPropertyType[BACnetPropertyType["propPreserveDiscoveredDevices"] = 3859] = "propPreserveDiscoveredDevices";
    BACnetPropertyType[BACnetPropertyType["propHybridActivity"] = 3872] = "propHybridActivity";
    BACnetPropertyType[BACnetPropertyType["propBiosVersion"] = 3873] = "propBiosVersion";
    BACnetPropertyType[BACnetPropertyType["propFlow_1PercentDpOffset"] = 3874] = "propFlow_1PercentDpOffset";
    BACnetPropertyType[BACnetPropertyType["propFlow_2PercentDpOffset"] = 3875] = "propFlow_2PercentDpOffset";
    BACnetPropertyType[BACnetPropertyType["propFlow_1StrokeTime"] = 3876] = "propFlow_1StrokeTime";
    BACnetPropertyType[BACnetPropertyType["propFlow_2StrokeTime"] = 3877] = "propFlow_2StrokeTime";
    BACnetPropertyType[BACnetPropertyType["propFlow_1"] = 3878] = "propFlow_1";
    BACnetPropertyType[BACnetPropertyType["propFlow_2"] = 3879] = "propFlow_2";
    BACnetPropertyType[BACnetPropertyType["propExhaustPercentDpOffset"] = 3880] = "propExhaustPercentDpOffset";
    BACnetPropertyType[BACnetPropertyType["propDuctConfiguration"] = 3881] = "propDuctConfiguration";
    BACnetPropertyType[BACnetPropertyType["propTimeoutDelay"] = 3882] = "propTimeoutDelay";
    BACnetPropertyType[BACnetPropertyType["propFlowSetpointOccupancy"] = 3883] = "propFlowSetpointOccupancy";
    BACnetPropertyType[BACnetPropertyType["propBalancerOverride"] = 3884] = "propBalancerOverride";
    BACnetPropertyType[BACnetPropertyType["propEffectiveAutocalibrate"] = 3885] = "propEffectiveAutocalibrate";
    BACnetPropertyType[BACnetPropertyType["propAutocalStatus"] = 3886] = "propAutocalStatus";
    BACnetPropertyType[BACnetPropertyType["propArea_1"] = 3887] = "propArea_1";
    BACnetPropertyType[BACnetPropertyType["propArea_2"] = 3888] = "propArea_2";
    BACnetPropertyType[BACnetPropertyType["propOccMinFlow_1"] = 3889] = "propOccMinFlow_1";
    BACnetPropertyType[BACnetPropertyType["propOccMinFlow_2"] = 3890] = "propOccMinFlow_2";
    BACnetPropertyType[BACnetPropertyType["propMaxFlow_1"] = 3891] = "propMaxFlow_1";
    BACnetPropertyType[BACnetPropertyType["propMaxFlow_2"] = 3892] = "propMaxFlow_2";
    BACnetPropertyType[BACnetPropertyType["propPickupGain_1"] = 3893] = "propPickupGain_1";
    BACnetPropertyType[BACnetPropertyType["propSelectionItemIncludeAndSet"] = 3894] = "propSelectionItemIncludeAndSet";
    BACnetPropertyType[BACnetPropertyType["propExhaustArea"] = 3895] = "propExhaustArea";
    BACnetPropertyType[BACnetPropertyType["propExhaustPickupGain"] = 3896] = "propExhaustPickupGain";
    BACnetPropertyType[BACnetPropertyType["propOccExhaustDiff"] = 3897] = "propOccExhaustDiff";
    BACnetPropertyType[BACnetPropertyType["propNetworkAutocalibrate"] = 3898] = "propNetworkAutocalibrate";
    BACnetPropertyType[BACnetPropertyType["propSystemConfiguration"] = 3899] = "propSystemConfiguration";
    BACnetPropertyType[BACnetPropertyType["propSystemType"] = 3900] = "propSystemType";
    BACnetPropertyType[BACnetPropertyType["propAddress"] = 3901] = "propAddress";
    BACnetPropertyType[BACnetPropertyType["propExhaustFlow"] = 3902] = "propExhaustFlow";
    BACnetPropertyType[BACnetPropertyType["propExhaustStrokeTime"] = 3903] = "propExhaustStrokeTime";
    BACnetPropertyType[BACnetPropertyType["propRecalculateGainStatus"] = 3908] = "propRecalculateGainStatus";
    BACnetPropertyType[BACnetPropertyType["propCdMinFlow"] = 3909] = "propCdMinFlow";
    BACnetPropertyType[BACnetPropertyType["propHdMinFlow"] = 3910] = "propHdMinFlow";
    BACnetPropertyType[BACnetPropertyType["propCoolingMaxFlow"] = 3911] = "propCoolingMaxFlow";
    BACnetPropertyType[BACnetPropertyType["propApplicationMapped"] = 3912] = "propApplicationMapped";
    BACnetPropertyType[BACnetPropertyType["propOccupancyLevel"] = 3913] = "propOccupancyLevel";
    BACnetPropertyType[BACnetPropertyType["propVentilationRequirement"] = 3914] = "propVentilationRequirement";
    BACnetPropertyType[BACnetPropertyType["propCdOaPercent"] = 3915] = "propCdOaPercent";
    BACnetPropertyType[BACnetPropertyType["propHdOaPercent"] = 3916] = "propHdOaPercent";
    BACnetPropertyType[BACnetPropertyType["propMinFlowResetType"] = 3917] = "propMinFlowResetType";
    BACnetPropertyType[BACnetPropertyType["propEffCdMinFlow"] = 3918] = "propEffCdMinFlow";
    BACnetPropertyType[BACnetPropertyType["propEffHdMinFlow"] = 3919] = "propEffHdMinFlow";
    BACnetPropertyType[BACnetPropertyType["propEffCdMaxFlow"] = 3920] = "propEffCdMaxFlow";
    BACnetPropertyType[BACnetPropertyType["propEffHdMaxFlow"] = 3921] = "propEffHdMaxFlow";
    BACnetPropertyType[BACnetPropertyType["propIdSet"] = 3922] = "propIdSet";
    BACnetPropertyType[BACnetPropertyType["propControlSequenceOid"] = 3923] = "propControlSequenceOid";
    BACnetPropertyType[BACnetPropertyType["propVavBalancerPrimitiveOid"] = 3924] = "propVavBalancerPrimitiveOid";
    BACnetPropertyType[BACnetPropertyType["propLibraryPartId"] = 3925] = "propLibraryPartId";
    BACnetPropertyType[BACnetPropertyType["propSelectionDescriptorToItemI"] = 3926] = "propSelectionDescriptorToItemI";
    BACnetPropertyType[BACnetPropertyType["propSelectionModuleId"] = 3927] = "propSelectionModuleId";
    BACnetPropertyType[BACnetPropertyType["propCovMinSendTime"] = 3929] = "propCovMinSendTime";
    BACnetPropertyType[BACnetPropertyType["propUseCovMinSendTime"] = 3930] = "propUseCovMinSendTime";
    BACnetPropertyType[BACnetPropertyType["propStandardMinimumTuneBand"] = 3931] = "propStandardMinimumTuneBand";
    BACnetPropertyType[BACnetPropertyType["propCwTemperature"] = 3935] = "propCwTemperature";
    BACnetPropertyType[BACnetPropertyType["propChwTemperature"] = 3936] = "propChwTemperature";
    BACnetPropertyType[BACnetPropertyType["propCapacityLimitUserInput"] = 3939] = "propCapacityLimitUserInput";
    BACnetPropertyType[BACnetPropertyType["propTowerCommandedFlow"] = 3941] = "propTowerCommandedFlow";
    BACnetPropertyType[BACnetPropertyType["propTowerAvailableFlow"] = 3943] = "propTowerAvailableFlow";
    BACnetPropertyType[BACnetPropertyType["propTotalCurrentPower"] = 3944] = "propTotalCurrentPower";
    BACnetPropertyType[BACnetPropertyType["propRequiredTowerFlow"] = 3946] = "propRequiredTowerFlow";
    BACnetPropertyType[BACnetPropertyType["propCurrentCop"] = 3963] = "propCurrentCop";
    BACnetPropertyType[BACnetPropertyType["propPredictedCop"] = 3964] = "propPredictedCop";
    BACnetPropertyType[BACnetPropertyType["propPredictedAdjustedCop"] = 3965] = "propPredictedAdjustedCop";
    BACnetPropertyType[BACnetPropertyType["propOsVersion"] = 3982] = "propOsVersion";
    BACnetPropertyType[BACnetPropertyType["propEnableObjectTypeValidation"] = 3983] = "propEnableObjectTypeValidation";
    BACnetPropertyType[BACnetPropertyType["propFipsComplianceStatus"] = 3984] = "propFipsComplianceStatus";
    BACnetPropertyType[BACnetPropertyType["propJciCovIncrement"] = 3985] = "propJciCovIncrement";
    BACnetPropertyType[BACnetPropertyType["propUsbPort_1Enabled"] = 3986] = "propUsbPort_1Enabled";
    BACnetPropertyType[BACnetPropertyType["propUsbPort_2Enabled"] = 3987] = "propUsbPort_2Enabled";
    BACnetPropertyType[BACnetPropertyType["propJciCommand"] = 4017] = "propJciCommand";
    BACnetPropertyType[BACnetPropertyType["propOperationMode"] = 4023] = "propOperationMode";
    BACnetPropertyType[BACnetPropertyType["propCorruptedResponses"] = 4084] = "propCorruptedResponses";
    BACnetPropertyType[BACnetPropertyType["propCorruptedPolls"] = 4089] = "propCorruptedPolls";
    BACnetPropertyType[BACnetPropertyType["propTargetAttribute"] = 4123] = "propTargetAttribute";
    BACnetPropertyType[BACnetPropertyType["propSignalType"] = 4126] = "propSignalType";
    BACnetPropertyType[BACnetPropertyType["propMonitorOnly"] = 4127] = "propMonitorOnly";
    BACnetPropertyType[BACnetPropertyType["propApplicationClassSetVersion"] = 4128] = "propApplicationClassSetVersion";
    BACnetPropertyType[BACnetPropertyType["propDeviceModelClassSetVersion"] = 4129] = "propDeviceModelClassSetVersion";
    BACnetPropertyType[BACnetPropertyType["propSetPresentValue"] = 4143] = "propSetPresentValue";
    BACnetPropertyType[BACnetPropertyType["propLocalUserName"] = 4149] = "propLocalUserName";
    BACnetPropertyType[BACnetPropertyType["propLocalPassword"] = 4150] = "propLocalPassword";
    BACnetPropertyType[BACnetPropertyType["propFcbMacAddress"] = 4153] = "propFcbMacAddress";
    BACnetPropertyType[BACnetPropertyType["propTimeFormatPref"] = 4154] = "propTimeFormatPref";
    BACnetPropertyType[BACnetPropertyType["propDispPrecisionStyle"] = 4155] = "propDispPrecisionStyle";
    BACnetPropertyType[BACnetPropertyType["propDateFormatPref"] = 4156] = "propDateFormatPref";
    BACnetPropertyType[BACnetPropertyType["propFcbBaudRate"] = 4157] = "propFcbBaudRate";
    BACnetPropertyType[BACnetPropertyType["propProtocolRevisionDate"] = 4158] = "propProtocolRevisionDate";
    BACnetPropertyType[BACnetPropertyType["propProtocolRevisionTime"] = 4159] = "propProtocolRevisionTime";
    BACnetPropertyType[BACnetPropertyType["propVendorDll"] = 4160] = "propVendorDll";
    BACnetPropertyType[BACnetPropertyType["propFunctionTimeExceeded"] = 4161] = "propFunctionTimeExceeded";
    BACnetPropertyType[BACnetPropertyType["propVendorReference"] = 4162] = "propVendorReference";
    BACnetPropertyType[BACnetPropertyType["propVendorConfigurationData"] = 4163] = "propVendorConfigurationData";
    BACnetPropertyType[BACnetPropertyType["propTransmitsOut"] = 4164] = "propTransmitsOut";
    BACnetPropertyType[BACnetPropertyType["propTransmitsIn"] = 4165] = "propTransmitsIn";
    BACnetPropertyType[BACnetPropertyType["propFieldValue"] = 4166] = "propFieldValue";
    BACnetPropertyType[BACnetPropertyType["propVendorStatus"] = 4167] = "propVendorStatus";
    BACnetPropertyType[BACnetPropertyType["propVendorRevisionTime"] = 4168] = "propVendorRevisionTime";
    BACnetPropertyType[BACnetPropertyType["propVendorRevisionDate"] = 4169] = "propVendorRevisionDate";
    BACnetPropertyType[BACnetPropertyType["propVendorIntegrationSize"] = 4170] = "propVendorIntegrationSize";
    BACnetPropertyType[BACnetPropertyType["propProtocolDescription"] = 4171] = "propProtocolDescription";
    BACnetPropertyType[BACnetPropertyType["propDlTariffTargets"] = 4185] = "propDlTariffTargets";
    BACnetPropertyType[BACnetPropertyType["propLrTariffTargets"] = 4186] = "propLrTariffTargets";
    BACnetPropertyType[BACnetPropertyType["propShedStrategy"] = 4187] = "propShedStrategy";
    BACnetPropertyType[BACnetPropertyType["propSnmpMessageFormat"] = 4188] = "propSnmpMessageFormat";
    BACnetPropertyType[BACnetPropertyType["propUnreliableMeterOptions"] = 4189] = "propUnreliableMeterOptions";
    BACnetPropertyType[BACnetPropertyType["propUnreliableMeterShedRate"] = 4190] = "propUnreliableMeterShedRate";
    BACnetPropertyType[BACnetPropertyType["propProfileTrackingPeriod"] = 4191] = "propProfileTrackingPeriod";
    BACnetPropertyType[BACnetPropertyType["propMeterStatus"] = 4192] = "propMeterStatus";
    BACnetPropertyType[BACnetPropertyType["propEoiStatus"] = 4193] = "propEoiStatus";
    BACnetPropertyType[BACnetPropertyType["propEnergyRate"] = 4194] = "propEnergyRate";
    BACnetPropertyType[BACnetPropertyType["propActiveDlTargetChanged"] = 4195] = "propActiveDlTargetChanged";
    BACnetPropertyType[BACnetPropertyType["propActiveLrTargetChanged"] = 4196] = "propActiveLrTargetChanged";
    BACnetPropertyType[BACnetPropertyType["propTodaysSchedule"] = 4198] = "propTodaysSchedule";
    BACnetPropertyType[BACnetPropertyType["propCalculatedDemand"] = 4200] = "propCalculatedDemand";
    BACnetPropertyType[BACnetPropertyType["propAlarmReferenceForIneligibil"] = 4201] = "propAlarmReferenceForIneligibil";
    BACnetPropertyType[BACnetPropertyType["propComfortOverride"] = 4203] = "propComfortOverride";
    BACnetPropertyType[BACnetPropertyType["propShedCommand"] = 4204] = "propShedCommand";
    BACnetPropertyType[BACnetPropertyType["propShedStatus"] = 4205] = "propShedStatus";
    BACnetPropertyType[BACnetPropertyType["propActiveTimer"] = 4206] = "propActiveTimer";
    BACnetPropertyType[BACnetPropertyType["propSignupCount"] = 4207] = "propSignupCount";
    BACnetPropertyType[BACnetPropertyType["propActiveDlTarget"] = 4208] = "propActiveDlTarget";
    BACnetPropertyType[BACnetPropertyType["propActiveLrTarget"] = 4209] = "propActiveLrTarget";
    BACnetPropertyType[BACnetPropertyType["propBacnetCommunicationsPassword"] = 4211] = "propBacnetCommunicationsPassword";
    BACnetPropertyType[BACnetPropertyType["propEligibleForEarlyRelease"] = 4213] = "propEligibleForEarlyRelease";
    BACnetPropertyType[BACnetPropertyType["propLastUsableUtilityProfileUp"] = 4254] = "propLastUsableUtilityProfileUp";
    BACnetPropertyType[BACnetPropertyType["propMaxRomutecBiPoints"] = 4261] = "propMaxRomutecBiPoints";
    BACnetPropertyType[BACnetPropertyType["propMaxRomutecBoPoints"] = 4262] = "propMaxRomutecBoPoints";
    BACnetPropertyType[BACnetPropertyType["propMaxRomutecAiPoints"] = 4263] = "propMaxRomutecAiPoints";
    BACnetPropertyType[BACnetPropertyType["propMaxRomutecAoPoints"] = 4264] = "propMaxRomutecAoPoints";
    BACnetPropertyType[BACnetPropertyType["propJciInterfaceValue"] = 4265] = "propJciInterfaceValue";
    BACnetPropertyType[BACnetPropertyType["propParentValue"] = 4266] = "propParentValue";
    BACnetPropertyType[BACnetPropertyType["propOnRelease"] = 4267] = "propOnRelease";
    BACnetPropertyType[BACnetPropertyType["propIsValidated"] = 4271] = "propIsValidated";
    BACnetPropertyType[BACnetPropertyType["propDllrStartupBehavior"] = 4272] = "propDllrStartupBehavior";
    BACnetPropertyType[BACnetPropertyType["propCurrentAmountEligibleToBe"] = 4273] = "propCurrentAmountEligibleToBe";
    BACnetPropertyType[BACnetPropertyType["propDisableOfflineReporting"] = 4277] = "propDisableOfflineReporting";
    BACnetPropertyType[BACnetPropertyType["propXifPresent"] = 4278] = "propXifPresent";
    BACnetPropertyType[BACnetPropertyType["propLastShedDate"] = 4279] = "propLastShedDate";
    BACnetPropertyType[BACnetPropertyType["propStartupDictionaryId"] = 4285] = "propStartupDictionaryId";
    BACnetPropertyType[BACnetPropertyType["propAllowResetInShedMode"] = 4287] = "propAllowResetInShedMode";
    BACnetPropertyType[BACnetPropertyType["propLoadShedIndexes"] = 4288] = "propLoadShedIndexes";
    BACnetPropertyType[BACnetPropertyType["propEventActionWhenFull"] = 4296] = "propEventActionWhenFull";
    BACnetPropertyType[BACnetPropertyType["propPolledObjectCount"] = 4301] = "propPolledObjectCount";
    BACnetPropertyType[BACnetPropertyType["propBacnetIntegratedObjects"] = 4302] = "propBacnetIntegratedObjects";
    BACnetPropertyType[BACnetPropertyType["propJciController"] = 4303] = "propJciController";
    BACnetPropertyType[BACnetPropertyType["propNotificationObjectReference"] = 4304] = "propNotificationObjectReference";
    BACnetPropertyType[BACnetPropertyType["propIntrinsicAlarmingDisabled"] = 4305] = "propIntrinsicAlarmingDisabled";
    BACnetPropertyType[BACnetPropertyType["propStoredEventEnable"] = 4306] = "propStoredEventEnable";
    BACnetPropertyType[BACnetPropertyType["propRoutingMode"] = 4307] = "propRoutingMode";
    BACnetPropertyType[BACnetPropertyType["propAlarmingDisabled"] = 4308] = "propAlarmingDisabled";
    BACnetPropertyType[BACnetPropertyType["propNetRoutedMessages"] = 4309] = "propNetRoutedMessages";
    BACnetPropertyType[BACnetPropertyType["propBacnetRoutedMessagesRate"] = 4310] = "propBacnetRoutedMessagesRate";
    BACnetPropertyType[BACnetPropertyType["propZoneOccupancy"] = 4334] = "propZoneOccupancy";
    BACnetPropertyType[BACnetPropertyType["propSicsBehavior"] = 4349] = "propSicsBehavior";
    BACnetPropertyType[BACnetPropertyType["propStopDllrAuditsInMonitorOn"] = 4500] = "propStopDllrAuditsInMonitorOn";
    BACnetPropertyType[BACnetPropertyType["propApplicationCov"] = 4512] = "propApplicationCov";
    BACnetPropertyType[BACnetPropertyType["propSabDeviceStatusList"] = 4513] = "propSabDeviceStatusList";
    BACnetPropertyType[BACnetPropertyType["propSabDeviceStatusListChanged"] = 4514] = "propSabDeviceStatusListChanged";
    BACnetPropertyType[BACnetPropertyType["propColumnDefinitions"] = 4560] = "propColumnDefinitions";
    BACnetPropertyType[BACnetPropertyType["propKeyData"] = 4561] = "propKeyData";
    BACnetPropertyType[BACnetPropertyType["propEnforceStrictBacnetComplian"] = 4581] = "propEnforceStrictBacnetComplian";
    BACnetPropertyType[BACnetPropertyType["propRowHeader"] = 4582] = "propRowHeader";
    BACnetPropertyType[BACnetPropertyType["propSignatureAlarmPriorityThres"] = 4584] = "propSignatureAlarmPriorityThres";
    BACnetPropertyType[BACnetPropertyType["propAnnotationAlarmPriorityThre"] = 4585] = "propAnnotationAlarmPriorityThre";
    BACnetPropertyType[BACnetPropertyType["propMaintenanceSwitch"] = 4678] = "propMaintenanceSwitch";
    BACnetPropertyType[BACnetPropertyType["propOffOn"] = 4679] = "propOffOn";
    BACnetPropertyType[BACnetPropertyType["propUsage"] = 4680] = "propUsage";
    BACnetPropertyType[BACnetPropertyType["propManipulatedVariableReference"] = 4682] = "propManipulatedVariableReference";
    BACnetPropertyType[BACnetPropertyType["propControlledVariableReference"] = 4683] = "propControlledVariableReference";
    BACnetPropertyType[BACnetPropertyType["propProportionalConstantReferenc"] = 4684] = "propProportionalConstantReferenc";
    BACnetPropertyType[BACnetPropertyType["propIntegralConstantReference"] = 4685] = "propIntegralConstantReference";
    BACnetPropertyType[BACnetPropertyType["propDerivativeConstantReference"] = 4686] = "propDerivativeConstantReference";
    BACnetPropertyType[BACnetPropertyType["propBiasReference"] = 4687] = "propBiasReference";
    BACnetPropertyType[BACnetPropertyType["propMaximumOutputReference"] = 4688] = "propMaximumOutputReference";
    BACnetPropertyType[BACnetPropertyType["propMinimumOutputReference"] = 4689] = "propMinimumOutputReference";
    BACnetPropertyType[BACnetPropertyType["propSetpointVariableReference"] = 4690] = "propSetpointVariableReference";
    BACnetPropertyType[BACnetPropertyType["propScaleAsInteger"] = 4692] = "propScaleAsInteger";
    BACnetPropertyType[BACnetPropertyType["propScaleAsFloat"] = 4693] = "propScaleAsFloat";
    BACnetPropertyType[BACnetPropertyType["propScaledPresentValue"] = 4694] = "propScaledPresentValue";
    BACnetPropertyType[BACnetPropertyType["propJciLoggingObjectReference"] = 4696] = "propJciLoggingObjectReference";
    BACnetPropertyType[BACnetPropertyType["propLoadBalancerLevel"] = 4722] = "propLoadBalancerLevel";
    BACnetPropertyType[BACnetPropertyType["propOperatingCapacity"] = 4728] = "propOperatingCapacity";
    BACnetPropertyType[BACnetPropertyType["propAvailableCapacity"] = 4729] = "propAvailableCapacity";
    BACnetPropertyType[BACnetPropertyType["propTemperatureIn"] = 4782] = "propTemperatureIn";
    BACnetPropertyType[BACnetPropertyType["propTemperatureOut"] = 4783] = "propTemperatureOut";
    BACnetPropertyType[BACnetPropertyType["propMediaType"] = 4784] = "propMediaType";
    BACnetPropertyType[BACnetPropertyType["propGlycolConcentration"] = 4785] = "propGlycolConcentration";
    BACnetPropertyType[BACnetPropertyType["propLoad"] = 4787] = "propLoad";
    BACnetPropertyType[BACnetPropertyType["propWd1"] = 4788] = "propWd1";
    BACnetPropertyType[BACnetPropertyType["propWd2"] = 4789] = "propWd2";
    BACnetPropertyType[BACnetPropertyType["propWd3"] = 4790] = "propWd3";
    BACnetPropertyType[BACnetPropertyType["propWc1"] = 4791] = "propWc1";
    BACnetPropertyType[BACnetPropertyType["propWc2"] = 4792] = "propWc2";
    BACnetPropertyType[BACnetPropertyType["propWc3"] = 4793] = "propWc3";
    BACnetPropertyType[BACnetPropertyType["propEd1"] = 4794] = "propEd1";
    BACnetPropertyType[BACnetPropertyType["propEd2"] = 4795] = "propEd2";
    BACnetPropertyType[BACnetPropertyType["propEd3"] = 4796] = "propEd3";
    BACnetPropertyType[BACnetPropertyType["propEd4"] = 4797] = "propEd4";
    BACnetPropertyType[BACnetPropertyType["propEd5"] = 4798] = "propEd5";
    BACnetPropertyType[BACnetPropertyType["propEd6"] = 4799] = "propEd6";
    BACnetPropertyType[BACnetPropertyType["propEc1"] = 4800] = "propEc1";
    BACnetPropertyType[BACnetPropertyType["propEc2"] = 4801] = "propEc2";
    BACnetPropertyType[BACnetPropertyType["propEc3"] = 4802] = "propEc3";
    BACnetPropertyType[BACnetPropertyType["propEc4"] = 4803] = "propEc4";
    BACnetPropertyType[BACnetPropertyType["propEc5"] = 4804] = "propEc5";
    BACnetPropertyType[BACnetPropertyType["propEc6"] = 4805] = "propEc6";
    BACnetPropertyType[BACnetPropertyType["propPd1"] = 4806] = "propPd1";
    BACnetPropertyType[BACnetPropertyType["propPd2"] = 4807] = "propPd2";
    BACnetPropertyType[BACnetPropertyType["propPd3"] = 4808] = "propPd3";
    BACnetPropertyType[BACnetPropertyType["propPd4"] = 4809] = "propPd4";
    BACnetPropertyType[BACnetPropertyType["propPd5"] = 4810] = "propPd5";
    BACnetPropertyType[BACnetPropertyType["propPd6"] = 4811] = "propPd6";
    BACnetPropertyType[BACnetPropertyType["propPc1"] = 4812] = "propPc1";
    BACnetPropertyType[BACnetPropertyType["propPc2"] = 4813] = "propPc2";
    BACnetPropertyType[BACnetPropertyType["propPc3"] = 4814] = "propPc3";
    BACnetPropertyType[BACnetPropertyType["propPc4"] = 4815] = "propPc4";
    BACnetPropertyType[BACnetPropertyType["propPc5"] = 4816] = "propPc5";
    BACnetPropertyType[BACnetPropertyType["propPc6"] = 4817] = "propPc6";
    BACnetPropertyType[BACnetPropertyType["propBlockingOnTime"] = 4818] = "propBlockingOnTime";
    BACnetPropertyType[BACnetPropertyType["propMaxOffTime"] = 4819] = "propMaxOffTime";
    BACnetPropertyType[BACnetPropertyType["propTotalOffTime"] = 4820] = "propTotalOffTime";
    BACnetPropertyType[BACnetPropertyType["propNumberOfEngineReporting"] = 4821] = "propNumberOfEngineReporting";
    BACnetPropertyType[BACnetPropertyType["propUpperOptimalPctLoad"] = 4822] = "propUpperOptimalPctLoad";
    BACnetPropertyType[BACnetPropertyType["propLowerOptimalPctLoad"] = 4823] = "propLowerOptimalPctLoad";
    BACnetPropertyType[BACnetPropertyType["propMinRequiredCapacity"] = 4824] = "propMinRequiredCapacity";
    BACnetPropertyType[BACnetPropertyType["propDerateNow"] = 4825] = "propDerateNow";
    BACnetPropertyType[BACnetPropertyType["propDerateReset"] = 4826] = "propDerateReset";
    BACnetPropertyType[BACnetPropertyType["propHysteresis"] = 4827] = "propHysteresis";
    BACnetPropertyType[BACnetPropertyType["propStagingMargin"] = 4828] = "propStagingMargin";
    BACnetPropertyType[BACnetPropertyType["propCurrentPercentLoad"] = 4830] = "propCurrentPercentLoad";
    BACnetPropertyType[BACnetPropertyType["propCurrentCapacity"] = 4831] = "propCurrentCapacity";
    BACnetPropertyType[BACnetPropertyType["propCurrentEfficiency"] = 4832] = "propCurrentEfficiency";
    BACnetPropertyType[BACnetPropertyType["propRotationMode"] = 4833] = "propRotationMode";
    BACnetPropertyType[BACnetPropertyType["propDeviceNnCapacity"] = 4834] = "propDeviceNnCapacity";
    BACnetPropertyType[BACnetPropertyType["propDeviceNnPeakEfficiency"] = 4835] = "propDeviceNnPeakEfficiency";
    BACnetPropertyType[BACnetPropertyType["propDeratingValueNn"] = 4836] = "propDeratingValueNn";
    BACnetPropertyType[BACnetPropertyType["propRequiredDevices"] = 4837] = "propRequiredDevices";
    BACnetPropertyType[BACnetPropertyType["propRequiredInterimDevices"] = 4838] = "propRequiredInterimDevices";
    BACnetPropertyType[BACnetPropertyType["propPredictedPercentLoad"] = 4839] = "propPredictedPercentLoad";
    BACnetPropertyType[BACnetPropertyType["propPredictedEfficiency"] = 4840] = "propPredictedEfficiency";
    BACnetPropertyType[BACnetPropertyType["propPredictedAdjustedEfficiency"] = 4841] = "propPredictedAdjustedEfficiency";
    BACnetPropertyType[BACnetPropertyType["propProcessVariableUnits"] = 4842] = "propProcessVariableUnits";
    BACnetPropertyType[BACnetPropertyType["propSystemEnabled"] = 4843] = "propSystemEnabled";
    BACnetPropertyType[BACnetPropertyType["propCwCommandedFlow"] = 4844] = "propCwCommandedFlow";
    BACnetPropertyType[BACnetPropertyType["propCwAvailableFlow"] = 4845] = "propCwAvailableFlow";
    BACnetPropertyType[BACnetPropertyType["propChwCommandedFlow"] = 4846] = "propChwCommandedFlow";
    BACnetPropertyType[BACnetPropertyType["propChwAvailableFlow"] = 4847] = "propChwAvailableFlow";
    BACnetPropertyType[BACnetPropertyType["propCoast"] = 4848] = "propCoast";
    BACnetPropertyType[BACnetPropertyType["propSystemStartDelay"] = 4849] = "propSystemStartDelay";
    BACnetPropertyType[BACnetPropertyType["propStabilizeTime"] = 4850] = "propStabilizeTime";
    BACnetPropertyType[BACnetPropertyType["propIsoValveStrokeTime"] = 4851] = "propIsoValveStrokeTime";
    BACnetPropertyType[BACnetPropertyType["propPumpDelay"] = 4852] = "propPumpDelay";
    BACnetPropertyType[BACnetPropertyType["propPumpDownTime"] = 4853] = "propPumpDownTime";
    BACnetPropertyType[BACnetPropertyType["propCapacityLimitHoldTime"] = 4854] = "propCapacityLimitHoldTime";
    BACnetPropertyType[BACnetPropertyType["propCapacityLimit"] = 4855] = "propCapacityLimit";
    BACnetPropertyType[BACnetPropertyType["propRequiredCwFlow"] = 4856] = "propRequiredCwFlow";
    BACnetPropertyType[BACnetPropertyType["propRequiredChwFlow"] = 4857] = "propRequiredChwFlow";
    BACnetPropertyType[BACnetPropertyType["propCwHeaderedDedicated"] = 4858] = "propCwHeaderedDedicated";
    BACnetPropertyType[BACnetPropertyType["propChwHeaderedDedicated"] = 4859] = "propChwHeaderedDedicated";
    BACnetPropertyType[BACnetPropertyType["propCurrentPowerUnits"] = 4861] = "propCurrentPowerUnits";
    BACnetPropertyType[BACnetPropertyType["propMaxDeltaChwt"] = 4866] = "propMaxDeltaChwt";
    BACnetPropertyType[BACnetPropertyType["propIsStable"] = 4867] = "propIsStable";
    BACnetPropertyType[BACnetPropertyType["propSteadySequenceRow"] = 4868] = "propSteadySequenceRow";
    BACnetPropertyType[BACnetPropertyType["propMinChwFlowSetpoint"] = 4869] = "propMinChwFlowSetpoint";
    BACnetPropertyType[BACnetPropertyType["propMinCwFlowSetpoint"] = 4870] = "propMinCwFlowSetpoint";
    BACnetPropertyType[BACnetPropertyType["propDeratingPercent"] = 4871] = "propDeratingPercent";
    BACnetPropertyType[BACnetPropertyType["propDeviceInfo"] = 4872] = "propDeviceInfo";
    BACnetPropertyType[BACnetPropertyType["propCapacityUnits"] = 4873] = "propCapacityUnits";
    BACnetPropertyType[BACnetPropertyType["propDeltaTemperatureUnits"] = 4874] = "propDeltaTemperatureUnits";
    BACnetPropertyType[BACnetPropertyType["propResetTuning"] = 4875] = "propResetTuning";
    BACnetPropertyType[BACnetPropertyType["propInputStatus"] = 4879] = "propInputStatus";
    BACnetPropertyType[BACnetPropertyType["propOutputPosition"] = 4904] = "propOutputPosition";
    BACnetPropertyType[BACnetPropertyType["propOutputOverridden"] = 4905] = "propOutputOverridden";
    BACnetPropertyType[BACnetPropertyType["propLostStatusDelay"] = 4906] = "propLostStatusDelay";
    BACnetPropertyType[BACnetPropertyType["propNumberOfSurrogateObjects"] = 4918] = "propNumberOfSurrogateObjects";
    BACnetPropertyType[BACnetPropertyType["propEquipmentType"] = 4951] = "propEquipmentType";
    BACnetPropertyType[BACnetPropertyType["propTimerMessagesAborted"] = 4959] = "propTimerMessagesAborted";
    BACnetPropertyType[BACnetPropertyType["propAssetVersions"] = 4960] = "propAssetVersions";
    BACnetPropertyType[BACnetPropertyType["propStartupPhaseDiagnostic"] = 4961] = "propStartupPhaseDiagnostic";
    BACnetPropertyType[BACnetPropertyType["propLastInput"] = 4962] = "propLastInput";
    BACnetPropertyType[BACnetPropertyType["propLastOutput"] = 4963] = "propLastOutput";
    BACnetPropertyType[BACnetPropertyType["propLambda"] = 4964] = "propLambda";
    BACnetPropertyType[BACnetPropertyType["propProtocolServicesToEliminate"] = 4967] = "propProtocolServicesToEliminate";
    BACnetPropertyType[BACnetPropertyType["propClassesToEliminate"] = 4968] = "propClassesToEliminate";
    BACnetPropertyType[BACnetPropertyType["propEmulate_3rdPartyDevice"] = 4969] = "propEmulate_3rdPartyDevice";
    BACnetPropertyType[BACnetPropertyType["propAcceptBacnetTimeSync"] = 4970] = "propAcceptBacnetTimeSync";
    BACnetPropertyType[BACnetPropertyType["propSntpServer"] = 4987] = "propSntpServer";
    BACnetPropertyType[BACnetPropertyType["propReaderString"] = 4993] = "propReaderString";
    BACnetPropertyType[BACnetPropertyType["propStartTimeOfMonitoring"] = 5560] = "propStartTimeOfMonitoring";
    BACnetPropertyType[BACnetPropertyType["propContractReceivingPower"] = 5562] = "propContractReceivingPower";
    BACnetPropertyType[BACnetPropertyType["propTargetValueOfPower"] = 5563] = "propTargetValueOfPower";
    BACnetPropertyType[BACnetPropertyType["propAlarmValueOfPower"] = 5564] = "propAlarmValueOfPower";
    BACnetPropertyType[BACnetPropertyType["propElapsedTime"] = 5565] = "propElapsedTime";
    BACnetPropertyType[BACnetPropertyType["propConsumedWhInThisTerm"] = 5566] = "propConsumedWhInThisTerm";
    BACnetPropertyType[BACnetPropertyType["propEstimatedPower"] = 5567] = "propEstimatedPower";
    BACnetPropertyType[BACnetPropertyType["propAdjustPower"] = 5568] = "propAdjustPower";
    BACnetPropertyType[BACnetPropertyType["propLevelValue"] = 5570] = "propLevelValue";
    BACnetPropertyType[BACnetPropertyType["propTargetValueToSupply"] = 5576] = "propTargetValueToSupply";
    BACnetPropertyType[BACnetPropertyType["propAdjustValueOfLoad"] = 5577] = "propAdjustValueOfLoad";
    BACnetPropertyType[BACnetPropertyType["propConsumedWhInLastTerm"] = 5580] = "propConsumedWhInLastTerm";
    BACnetPropertyType[BACnetPropertyType["propListOfPulseCounterReferenc"] = 5581] = "propListOfPulseCounterReferenc";
    BACnetPropertyType[BACnetPropertyType["propControlStartReference"] = 5700] = "propControlStartReference";
    BACnetPropertyType[BACnetPropertyType["propCurrentConsumedWhReference"] = 5701] = "propCurrentConsumedWhReference";
    BACnetPropertyType[BACnetPropertyType["propControlType"] = 5702] = "propControlType";
    BACnetPropertyType[BACnetPropertyType["propSamplingInterval"] = 5703] = "propSamplingInterval";
    BACnetPropertyType[BACnetPropertyType["propConsecutiveSamples"] = 5704] = "propConsecutiveSamples";
    BACnetPropertyType[BACnetPropertyType["propRecoveryPowerOffset"] = 5705] = "propRecoveryPowerOffset";
    BACnetPropertyType[BACnetPropertyType["propControlStartState"] = 5706] = "propControlStartState";
    BACnetPropertyType[BACnetPropertyType["propCurrentConsumedWh"] = 5707] = "propCurrentConsumedWh";
    BACnetPropertyType[BACnetPropertyType["propDemandMonitoringObjectRefer"] = 5708] = "propDemandMonitoringObjectRefer";
    BACnetPropertyType[BACnetPropertyType["propDemandAdjustPower"] = 5709] = "propDemandAdjustPower";
    BACnetPropertyType[BACnetPropertyType["propDemandAlarmValue"] = 5710] = "propDemandAlarmValue";
    BACnetPropertyType[BACnetPropertyType["propDemandElapsedTime"] = 5711] = "propDemandElapsedTime";
    BACnetPropertyType[BACnetPropertyType["propDemandTargetOfValuePower"] = 5712] = "propDemandTargetOfValuePower";
    BACnetPropertyType[BACnetPropertyType["propDemandEstimatedPower"] = 5713] = "propDemandEstimatedPower";
    BACnetPropertyType[BACnetPropertyType["propTimeSynchronizationMode"] = 5714] = "propTimeSynchronizationMode";
    BACnetPropertyType[BACnetPropertyType["propTimeToMask"] = 5715] = "propTimeToMask";
    BACnetPropertyType[BACnetPropertyType["propInputMode"] = 5716] = "propInputMode";
    BACnetPropertyType[BACnetPropertyType["propEoiObject"] = 5717] = "propEoiObject";
    BACnetPropertyType[BACnetPropertyType["propJpnRateConstant"] = 5718] = "propJpnRateConstant";
    BACnetPropertyType[BACnetPropertyType["propPulseConstant"] = 5719] = "propPulseConstant";
    BACnetPropertyType[BACnetPropertyType["propCurrentDemand"] = 5720] = "propCurrentDemand";
    BACnetPropertyType[BACnetPropertyType["propLastDemand"] = 5721] = "propLastDemand";
    BACnetPropertyType[BACnetPropertyType["propJciListOfPulseCounterRefe"] = 5722] = "propJciListOfPulseCounterRefe";
    BACnetPropertyType[BACnetPropertyType["propTransitionInterval"] = 5723] = "propTransitionInterval";
    BACnetPropertyType[BACnetPropertyType["propPresentValueTarget"] = 5724] = "propPresentValueTarget";
    BACnetPropertyType[BACnetPropertyType["propJciDemandMonitoringObjectR"] = 5725] = "propJciDemandMonitoringObjectR";
    BACnetPropertyType[BACnetPropertyType["propJciControlStartReference"] = 5726] = "propJciControlStartReference";
    BACnetPropertyType[BACnetPropertyType["propJciCurrentConsumedWhRefere"] = 5727] = "propJciCurrentConsumedWhRefere";
    BACnetPropertyType[BACnetPropertyType["propLastBacnetTimeSyncReceived"] = 5728] = "propLastBacnetTimeSyncReceived";
    BACnetPropertyType[BACnetPropertyType["propStagedFirmwareVersion"] = 5731] = "propStagedFirmwareVersion";
    BACnetPropertyType[BACnetPropertyType["propStagedFilesSet"] = 5732] = "propStagedFilesSet";
    BACnetPropertyType[BACnetPropertyType["propStagedFiles"] = 5733] = "propStagedFiles";
    BACnetPropertyType[BACnetPropertyType["propActiveSystemPartition"] = 5734] = "propActiveSystemPartition";
    BACnetPropertyType[BACnetPropertyType["propSelectionNodeNumber"] = 6001] = "propSelectionNodeNumber";
    BACnetPropertyType[BACnetPropertyType["propSupervisorOfflineTimeout"] = 6002] = "propSupervisorOfflineTimeout";
    BACnetPropertyType[BACnetPropertyType["propTestCase"] = 6005] = "propTestCase";
    BACnetPropertyType[BACnetPropertyType["propPassFail"] = 6006] = "propPassFail";
    BACnetPropertyType[BACnetPropertyType["propFailedTestCase"] = 6007] = "propFailedTestCase";
    BACnetPropertyType[BACnetPropertyType["propFailedAttribute"] = 6008] = "propFailedAttribute";
    BACnetPropertyType[BACnetPropertyType["propFailedValue"] = 6009] = "propFailedValue";
    BACnetPropertyType[BACnetPropertyType["propFailedReliability"] = 6010] = "propFailedReliability";
    BACnetPropertyType[BACnetPropertyType["propFailedCommandSignature"] = 6011] = "propFailedCommandSignature";
    BACnetPropertyType[BACnetPropertyType["propFailedStatus"] = 6012] = "propFailedStatus";
    BACnetPropertyType[BACnetPropertyType["propPublicAddress"] = 6047] = "propPublicAddress";
    BACnetPropertyType[BACnetPropertyType["propEquipmentServedBy"] = 6049] = "propEquipmentServedBy";
    BACnetPropertyType[BACnetPropertyType["propDefinitionLink"] = 6050] = "propDefinitionLink";
    BACnetPropertyType[BACnetPropertyType["propEventsLostAttributeReset"] = 6053] = "propEventsLostAttributeReset";
    BACnetPropertyType[BACnetPropertyType["propControllerNumber"] = 6056] = "propControllerNumber";
    BACnetPropertyType[BACnetPropertyType["propSystemOfUnitsSelection"] = 6057] = "propSystemOfUnitsSelection";
    BACnetPropertyType[BACnetPropertyType["propPresentValueWritable"] = 6080] = "propPresentValueWritable";
    BACnetPropertyType[BACnetPropertyType["propConnectedToInternalApplicat"] = 6081] = "propConnectedToInternalApplicat";
    BACnetPropertyType[BACnetPropertyType["propAdditionalBacnetAttributesS"] = 6082] = "propAdditionalBacnetAttributesS";
    BACnetPropertyType[BACnetPropertyType["propPrioritySupported"] = 6083] = "propPrioritySupported";
    BACnetPropertyType[BACnetPropertyType["propReferencedValue"] = 6084] = "propReferencedValue";
    BACnetPropertyType[BACnetPropertyType["propReferencedReliability"] = 6085] = "propReferencedReliability";
    BACnetPropertyType[BACnetPropertyType["propReferencedValueCosCount"] = 6086] = "propReferencedValueCosCount";
    BACnetPropertyType[BACnetPropertyType["propFailsoftCurrentlyActive"] = 6088] = "propFailsoftCurrentlyActive";
    BACnetPropertyType[BACnetPropertyType["propObjectCanNotBeDeleted"] = 6089] = "propObjectCanNotBeDeleted";
    BACnetPropertyType[BACnetPropertyType["propDataBitsString"] = 6090] = "propDataBitsString";
    BACnetPropertyType[BACnetPropertyType["propChannelDataType"] = 6091] = "propChannelDataType";
    BACnetPropertyType[BACnetPropertyType["propLightingCommandDisplay"] = 6092] = "propLightingCommandDisplay";
    BACnetPropertyType[BACnetPropertyType["propPriorityForWritingToConnec"] = 6093] = "propPriorityForWritingToConnec";
    BACnetPropertyType[BACnetPropertyType["propEthernet_1LinkSpeed"] = 6094] = "propEthernet_1LinkSpeed";
    BACnetPropertyType[BACnetPropertyType["propEthernet_2LinkSpeed"] = 6095] = "propEthernet_2LinkSpeed";
    BACnetPropertyType[BACnetPropertyType["propLastModificationDate"] = 6096] = "propLastModificationDate";
    BACnetPropertyType[BACnetPropertyType["propI1"] = 7000] = "propI1";
    BACnetPropertyType[BACnetPropertyType["propInput_1"] = 7001] = "propInput_1";
    BACnetPropertyType[BACnetPropertyType["propInput_2"] = 7002] = "propInput_2";
    BACnetPropertyType[BACnetPropertyType["propInput_25"] = 7025] = "propInput_25";
    BACnetPropertyType[BACnetPropertyType["propInput_26"] = 7026] = "propInput_26";
    BACnetPropertyType[BACnetPropertyType["propInput_27"] = 7027] = "propInput_27";
    BACnetPropertyType[BACnetPropertyType["propInput_28"] = 7028] = "propInput_28";
    BACnetPropertyType[BACnetPropertyType["propInput_29"] = 7029] = "propInput_29";
    BACnetPropertyType[BACnetPropertyType["propInput_30"] = 7030] = "propInput_30";
    BACnetPropertyType[BACnetPropertyType["propInput_31"] = 7031] = "propInput_31";
    BACnetPropertyType[BACnetPropertyType["propInput_32"] = 7032] = "propInput_32";
    BACnetPropertyType[BACnetPropertyType["propInput_33"] = 7033] = "propInput_33";
    BACnetPropertyType[BACnetPropertyType["propInput_34"] = 7034] = "propInput_34";
    BACnetPropertyType[BACnetPropertyType["propInput_35"] = 7035] = "propInput_35";
    BACnetPropertyType[BACnetPropertyType["propInput_36"] = 7036] = "propInput_36";
    BACnetPropertyType[BACnetPropertyType["propInput_37"] = 7037] = "propInput_37";
    BACnetPropertyType[BACnetPropertyType["propInput_38"] = 7038] = "propInput_38";
    BACnetPropertyType[BACnetPropertyType["propInput_39"] = 7039] = "propInput_39";
    BACnetPropertyType[BACnetPropertyType["propInput_40"] = 7040] = "propInput_40";
    BACnetPropertyType[BACnetPropertyType["propInput_41"] = 7041] = "propInput_41";
    BACnetPropertyType[BACnetPropertyType["propInput_42"] = 7042] = "propInput_42";
    BACnetPropertyType[BACnetPropertyType["propInput_43"] = 7043] = "propInput_43";
    BACnetPropertyType[BACnetPropertyType["propInput_44"] = 7044] = "propInput_44";
    BACnetPropertyType[BACnetPropertyType["propInput_45"] = 7045] = "propInput_45";
    BACnetPropertyType[BACnetPropertyType["propInput_46"] = 7046] = "propInput_46";
    BACnetPropertyType[BACnetPropertyType["propInput_47"] = 7047] = "propInput_47";
    BACnetPropertyType[BACnetPropertyType["propInput_48"] = 7048] = "propInput_48";
    BACnetPropertyType[BACnetPropertyType["propInput_49"] = 7049] = "propInput_49";
    BACnetPropertyType[BACnetPropertyType["propI51"] = 7050] = "propI51";
    BACnetPropertyType[BACnetPropertyType["propInput_51"] = 7051] = "propInput_51";
    BACnetPropertyType[BACnetPropertyType["propInput_52"] = 7052] = "propInput_52";
    BACnetPropertyType[BACnetPropertyType["propInput_53"] = 7053] = "propInput_53";
    BACnetPropertyType[BACnetPropertyType["propInput_54"] = 7054] = "propInput_54";
    BACnetPropertyType[BACnetPropertyType["propInput_55"] = 7055] = "propInput_55";
    BACnetPropertyType[BACnetPropertyType["propInput_56"] = 7056] = "propInput_56";
    BACnetPropertyType[BACnetPropertyType["propInput_57"] = 7057] = "propInput_57";
    BACnetPropertyType[BACnetPropertyType["propInput_58"] = 7058] = "propInput_58";
    BACnetPropertyType[BACnetPropertyType["propInput_59"] = 7059] = "propInput_59";
    BACnetPropertyType[BACnetPropertyType["propInput_60"] = 7060] = "propInput_60";
    BACnetPropertyType[BACnetPropertyType["propInput_61"] = 7061] = "propInput_61";
    BACnetPropertyType[BACnetPropertyType["propInput_62"] = 7062] = "propInput_62";
    BACnetPropertyType[BACnetPropertyType["propInput_63"] = 7063] = "propInput_63";
    BACnetPropertyType[BACnetPropertyType["propInput_64"] = 7064] = "propInput_64";
    BACnetPropertyType[BACnetPropertyType["propInput_65"] = 7065] = "propInput_65";
    BACnetPropertyType[BACnetPropertyType["propInput_66"] = 7066] = "propInput_66";
    BACnetPropertyType[BACnetPropertyType["propInput_67"] = 7067] = "propInput_67";
    BACnetPropertyType[BACnetPropertyType["propInput_68"] = 7068] = "propInput_68";
    BACnetPropertyType[BACnetPropertyType["propInput_69"] = 7069] = "propInput_69";
    BACnetPropertyType[BACnetPropertyType["propInput_70"] = 7070] = "propInput_70";
    BACnetPropertyType[BACnetPropertyType["propInput_71"] = 7071] = "propInput_71";
    BACnetPropertyType[BACnetPropertyType["propInput_72"] = 7072] = "propInput_72";
    BACnetPropertyType[BACnetPropertyType["propInput_73"] = 7073] = "propInput_73";
    BACnetPropertyType[BACnetPropertyType["propInput_74"] = 7074] = "propInput_74";
    BACnetPropertyType[BACnetPropertyType["propInput_75"] = 7075] = "propInput_75";
    BACnetPropertyType[BACnetPropertyType["propInput_76"] = 7076] = "propInput_76";
    BACnetPropertyType[BACnetPropertyType["propInput_77"] = 7077] = "propInput_77";
    BACnetPropertyType[BACnetPropertyType["propInput_78"] = 7078] = "propInput_78";
    BACnetPropertyType[BACnetPropertyType["propInput_79"] = 7079] = "propInput_79";
    BACnetPropertyType[BACnetPropertyType["propInput_80"] = 7080] = "propInput_80";
    BACnetPropertyType[BACnetPropertyType["propInput_81"] = 7081] = "propInput_81";
    BACnetPropertyType[BACnetPropertyType["propInput_82"] = 7082] = "propInput_82";
    BACnetPropertyType[BACnetPropertyType["propInput_83"] = 7083] = "propInput_83";
    BACnetPropertyType[BACnetPropertyType["propInput_84"] = 7084] = "propInput_84";
    BACnetPropertyType[BACnetPropertyType["propInput_85"] = 7085] = "propInput_85";
    BACnetPropertyType[BACnetPropertyType["propInput_86"] = 7086] = "propInput_86";
    BACnetPropertyType[BACnetPropertyType["propInput_87"] = 7087] = "propInput_87";
    BACnetPropertyType[BACnetPropertyType["propInput_88"] = 7088] = "propInput_88";
    BACnetPropertyType[BACnetPropertyType["propInput_89"] = 7089] = "propInput_89";
    BACnetPropertyType[BACnetPropertyType["propInput_90"] = 7090] = "propInput_90";
    BACnetPropertyType[BACnetPropertyType["propInput_91"] = 7091] = "propInput_91";
    BACnetPropertyType[BACnetPropertyType["propInput_92"] = 7092] = "propInput_92";
    BACnetPropertyType[BACnetPropertyType["propInput_93"] = 7093] = "propInput_93";
    BACnetPropertyType[BACnetPropertyType["propInput_94"] = 7094] = "propInput_94";
    BACnetPropertyType[BACnetPropertyType["propInput_95"] = 7095] = "propInput_95";
    BACnetPropertyType[BACnetPropertyType["propInput_96"] = 7096] = "propInput_96";
    BACnetPropertyType[BACnetPropertyType["propInput_97"] = 7097] = "propInput_97";
    BACnetPropertyType[BACnetPropertyType["propInput_98"] = 7098] = "propInput_98";
    BACnetPropertyType[BACnetPropertyType["propInput_99"] = 7099] = "propInput_99";
    BACnetPropertyType[BACnetPropertyType["propI101"] = 7100] = "propI101";
    BACnetPropertyType[BACnetPropertyType["propInput_101"] = 7101] = "propInput_101";
    BACnetPropertyType[BACnetPropertyType["propInput_102"] = 7102] = "propInput_102";
    BACnetPropertyType[BACnetPropertyType["propInput_103"] = 7103] = "propInput_103";
    BACnetPropertyType[BACnetPropertyType["propInput_104"] = 7104] = "propInput_104";
    BACnetPropertyType[BACnetPropertyType["propInput_105"] = 7105] = "propInput_105";
    BACnetPropertyType[BACnetPropertyType["propInput_106"] = 7106] = "propInput_106";
    BACnetPropertyType[BACnetPropertyType["propInput_107"] = 7107] = "propInput_107";
    BACnetPropertyType[BACnetPropertyType["propInput_108"] = 7108] = "propInput_108";
    BACnetPropertyType[BACnetPropertyType["propInput_109"] = 7109] = "propInput_109";
    BACnetPropertyType[BACnetPropertyType["propInput_110"] = 7110] = "propInput_110";
    BACnetPropertyType[BACnetPropertyType["propInput_111"] = 7111] = "propInput_111";
    BACnetPropertyType[BACnetPropertyType["propInput_112"] = 7112] = "propInput_112";
    BACnetPropertyType[BACnetPropertyType["propInput_113"] = 7113] = "propInput_113";
    BACnetPropertyType[BACnetPropertyType["propInput_114"] = 7114] = "propInput_114";
    BACnetPropertyType[BACnetPropertyType["propInput_115"] = 7115] = "propInput_115";
    BACnetPropertyType[BACnetPropertyType["propInput_116"] = 7116] = "propInput_116";
    BACnetPropertyType[BACnetPropertyType["propInput_117"] = 7117] = "propInput_117";
    BACnetPropertyType[BACnetPropertyType["propInput_118"] = 7118] = "propInput_118";
    BACnetPropertyType[BACnetPropertyType["propInput_119"] = 7119] = "propInput_119";
    BACnetPropertyType[BACnetPropertyType["propInput_120"] = 7120] = "propInput_120";
    BACnetPropertyType[BACnetPropertyType["propInput_121"] = 7121] = "propInput_121";
    BACnetPropertyType[BACnetPropertyType["propInput_122"] = 7122] = "propInput_122";
    BACnetPropertyType[BACnetPropertyType["propInput_123"] = 7123] = "propInput_123";
    BACnetPropertyType[BACnetPropertyType["propInput_124"] = 7124] = "propInput_124";
    BACnetPropertyType[BACnetPropertyType["propInput_125"] = 7125] = "propInput_125";
    BACnetPropertyType[BACnetPropertyType["propInput_126"] = 7126] = "propInput_126";
    BACnetPropertyType[BACnetPropertyType["propInput_127"] = 7127] = "propInput_127";
    BACnetPropertyType[BACnetPropertyType["propInput_128"] = 7128] = "propInput_128";
    BACnetPropertyType[BACnetPropertyType["propInput_129"] = 7129] = "propInput_129";
    BACnetPropertyType[BACnetPropertyType["propInput_130"] = 7130] = "propInput_130";
    BACnetPropertyType[BACnetPropertyType["propInput_131"] = 7131] = "propInput_131";
    BACnetPropertyType[BACnetPropertyType["propInput_132"] = 7132] = "propInput_132";
    BACnetPropertyType[BACnetPropertyType["propInput_133"] = 7133] = "propInput_133";
    BACnetPropertyType[BACnetPropertyType["propInput_134"] = 7134] = "propInput_134";
    BACnetPropertyType[BACnetPropertyType["propInput_135"] = 7135] = "propInput_135";
    BACnetPropertyType[BACnetPropertyType["propInput_136"] = 7136] = "propInput_136";
    BACnetPropertyType[BACnetPropertyType["propInput_137"] = 7137] = "propInput_137";
    BACnetPropertyType[BACnetPropertyType["propInput_138"] = 7138] = "propInput_138";
    BACnetPropertyType[BACnetPropertyType["propInput_139"] = 7139] = "propInput_139";
    BACnetPropertyType[BACnetPropertyType["propInput_140"] = 7140] = "propInput_140";
    BACnetPropertyType[BACnetPropertyType["propInput_141"] = 7141] = "propInput_141";
    BACnetPropertyType[BACnetPropertyType["propInput_142"] = 7142] = "propInput_142";
    BACnetPropertyType[BACnetPropertyType["propInput_143"] = 7143] = "propInput_143";
    BACnetPropertyType[BACnetPropertyType["propInput_144"] = 7144] = "propInput_144";
    BACnetPropertyType[BACnetPropertyType["propInput_145"] = 7145] = "propInput_145";
    BACnetPropertyType[BACnetPropertyType["propInput_146"] = 7146] = "propInput_146";
    BACnetPropertyType[BACnetPropertyType["propInput_147"] = 7147] = "propInput_147";
    BACnetPropertyType[BACnetPropertyType["propInput_148"] = 7148] = "propInput_148";
    BACnetPropertyType[BACnetPropertyType["propInput_149"] = 7149] = "propInput_149";
    BACnetPropertyType[BACnetPropertyType["propI151"] = 7150] = "propI151";
    BACnetPropertyType[BACnetPropertyType["propInput_151"] = 7151] = "propInput_151";
    BACnetPropertyType[BACnetPropertyType["propInput_152"] = 7152] = "propInput_152";
    BACnetPropertyType[BACnetPropertyType["propInput_153"] = 7153] = "propInput_153";
    BACnetPropertyType[BACnetPropertyType["propInput_154"] = 7154] = "propInput_154";
    BACnetPropertyType[BACnetPropertyType["propInput_155"] = 7155] = "propInput_155";
    BACnetPropertyType[BACnetPropertyType["propInput_156"] = 7156] = "propInput_156";
    BACnetPropertyType[BACnetPropertyType["propInput_157"] = 7157] = "propInput_157";
    BACnetPropertyType[BACnetPropertyType["propInput_158"] = 7158] = "propInput_158";
    BACnetPropertyType[BACnetPropertyType["propInput_159"] = 7159] = "propInput_159";
    BACnetPropertyType[BACnetPropertyType["propInput_160"] = 7160] = "propInput_160";
    BACnetPropertyType[BACnetPropertyType["propInput_161"] = 7161] = "propInput_161";
    BACnetPropertyType[BACnetPropertyType["propInput_162"] = 7162] = "propInput_162";
    BACnetPropertyType[BACnetPropertyType["propInput_163"] = 7163] = "propInput_163";
    BACnetPropertyType[BACnetPropertyType["propInput_164"] = 7164] = "propInput_164";
    BACnetPropertyType[BACnetPropertyType["propInput_165"] = 7165] = "propInput_165";
    BACnetPropertyType[BACnetPropertyType["propInput_166"] = 7166] = "propInput_166";
    BACnetPropertyType[BACnetPropertyType["propInput_167"] = 7167] = "propInput_167";
    BACnetPropertyType[BACnetPropertyType["propInput_168"] = 7168] = "propInput_168";
    BACnetPropertyType[BACnetPropertyType["propInput_169"] = 7169] = "propInput_169";
    BACnetPropertyType[BACnetPropertyType["propInput_170"] = 7170] = "propInput_170";
    BACnetPropertyType[BACnetPropertyType["propInput_171"] = 7171] = "propInput_171";
    BACnetPropertyType[BACnetPropertyType["propInput_172"] = 7172] = "propInput_172";
    BACnetPropertyType[BACnetPropertyType["propInput_173"] = 7173] = "propInput_173";
    BACnetPropertyType[BACnetPropertyType["propInput_174"] = 7174] = "propInput_174";
    BACnetPropertyType[BACnetPropertyType["propInput_175"] = 7175] = "propInput_175";
    BACnetPropertyType[BACnetPropertyType["propInput_176"] = 7176] = "propInput_176";
    BACnetPropertyType[BACnetPropertyType["propInput_177"] = 7177] = "propInput_177";
    BACnetPropertyType[BACnetPropertyType["propInput_178"] = 7178] = "propInput_178";
    BACnetPropertyType[BACnetPropertyType["propInput_179"] = 7179] = "propInput_179";
    BACnetPropertyType[BACnetPropertyType["propInput_180"] = 7180] = "propInput_180";
    BACnetPropertyType[BACnetPropertyType["propInput_181"] = 7181] = "propInput_181";
    BACnetPropertyType[BACnetPropertyType["propInput_182"] = 7182] = "propInput_182";
    BACnetPropertyType[BACnetPropertyType["propInput_183"] = 7183] = "propInput_183";
    BACnetPropertyType[BACnetPropertyType["propInput_184"] = 7184] = "propInput_184";
    BACnetPropertyType[BACnetPropertyType["propInput_185"] = 7185] = "propInput_185";
    BACnetPropertyType[BACnetPropertyType["propInput_186"] = 7186] = "propInput_186";
    BACnetPropertyType[BACnetPropertyType["propInput_187"] = 7187] = "propInput_187";
    BACnetPropertyType[BACnetPropertyType["propInput_188"] = 7188] = "propInput_188";
    BACnetPropertyType[BACnetPropertyType["propInput_189"] = 7189] = "propInput_189";
    BACnetPropertyType[BACnetPropertyType["propInput_190"] = 7190] = "propInput_190";
    BACnetPropertyType[BACnetPropertyType["propInput_191"] = 7191] = "propInput_191";
    BACnetPropertyType[BACnetPropertyType["propInput_192"] = 7192] = "propInput_192";
    BACnetPropertyType[BACnetPropertyType["propInput_193"] = 7193] = "propInput_193";
    BACnetPropertyType[BACnetPropertyType["propInput_194"] = 7194] = "propInput_194";
    BACnetPropertyType[BACnetPropertyType["propInput_195"] = 7195] = "propInput_195";
    BACnetPropertyType[BACnetPropertyType["propInput_196"] = 7196] = "propInput_196";
    BACnetPropertyType[BACnetPropertyType["propInput_197"] = 7197] = "propInput_197";
    BACnetPropertyType[BACnetPropertyType["propInput_198"] = 7198] = "propInput_198";
    BACnetPropertyType[BACnetPropertyType["propInput_199"] = 7199] = "propInput_199";
    BACnetPropertyType[BACnetPropertyType["propI201"] = 7200] = "propI201";
    BACnetPropertyType[BACnetPropertyType["propI251"] = 7250] = "propI251";
    BACnetPropertyType[BACnetPropertyType["propI301"] = 7300] = "propI301";
    BACnetPropertyType[BACnetPropertyType["propI334"] = 7333] = "propI334";
    BACnetPropertyType[BACnetPropertyType["propI351"] = 7350] = "propI351";
    BACnetPropertyType[BACnetPropertyType["propI401"] = 7400] = "propI401";
    BACnetPropertyType[BACnetPropertyType["propI501"] = 7500] = "propI501";
    BACnetPropertyType[BACnetPropertyType["propI601"] = 7600] = "propI601";
    BACnetPropertyType[BACnetPropertyType["propI667"] = 7666] = "propI667";
    BACnetPropertyType[BACnetPropertyType["propI751"] = 7750] = "propI751";
    BACnetPropertyType[BACnetPropertyType["propI801"] = 7800] = "propI801";
    BACnetPropertyType[BACnetPropertyType["propI826"] = 7825] = "propI826";
    BACnetPropertyType[BACnetPropertyType["propO1"] = 8000] = "propO1";
    BACnetPropertyType[BACnetPropertyType["propO51"] = 8050] = "propO51";
    BACnetPropertyType[BACnetPropertyType["propO101"] = 8100] = "propO101";
    BACnetPropertyType[BACnetPropertyType["propO201"] = 8200] = "propO201";
    BACnetPropertyType[BACnetPropertyType["propO251"] = 8250] = "propO251";
    BACnetPropertyType[BACnetPropertyType["propO501"] = 8500] = "propO501";
    BACnetPropertyType[BACnetPropertyType["propO751"] = 8750] = "propO751";
    BACnetPropertyType[BACnetPropertyType["propItemdefid"] = 10000] = "propItemdefid";
    BACnetPropertyType[BACnetPropertyType["propItemdefinternalid"] = 10001] = "propItemdefinternalid";
    BACnetPropertyType[BACnetPropertyType["propPartialref"] = 10002] = "propPartialref";
    BACnetPropertyType[BACnetPropertyType["propRefObjGuid"] = 10003] = "propRefObjGuid";
    BACnetPropertyType[BACnetPropertyType["propNextScheduleState"] = 10065] = "propNextScheduleState";
    BACnetPropertyType[BACnetPropertyType["propTimeUntilNextScheduleEvent"] = 10066] = "propTimeUntilNextScheduleEvent";
    BACnetPropertyType[BACnetPropertyType["propEquipmentList"] = 11030] = "propEquipmentList";
    BACnetPropertyType[BACnetPropertyType["propApplicationState"] = 11037] = "propApplicationState";
    BACnetPropertyType[BACnetPropertyType["propBusAnalysisTime"] = 12000] = "propBusAnalysisTime";
    BACnetPropertyType[BACnetPropertyType["propBusAnalysisDate"] = 12001] = "propBusAnalysisDate";
    BACnetPropertyType[BACnetPropertyType["propBusHealthIndex"] = 12002] = "propBusHealthIndex";
    BACnetPropertyType[BACnetPropertyType["propBusPerformanceIndex"] = 12003] = "propBusPerformanceIndex";
    BACnetPropertyType[BACnetPropertyType["propBusAnalysisProgress"] = 12005] = "propBusAnalysisProgress";
    BACnetPropertyType[BACnetPropertyType["propBusDeviceConfigurationList"] = 12006] = "propBusDeviceConfigurationList";
    BACnetPropertyType[BACnetPropertyType["propWeightedBusHealthConstant"] = 12007] = "propWeightedBusHealthConstant";
    BACnetPropertyType[BACnetPropertyType["propWeightedBusPerformanceConst"] = 12008] = "propWeightedBusPerformanceConst";
    BACnetPropertyType[BACnetPropertyType["propBroadcastReceiveRate"] = 12009] = "propBroadcastReceiveRate";
    BACnetPropertyType[BACnetPropertyType["propBroadcastTransmitRate"] = 12010] = "propBroadcastTransmitRate";
    BACnetPropertyType[BACnetPropertyType["propSequenceRowTransitionDelay"] = 12045] = "propSequenceRowTransitionDelay";
    BACnetPropertyType[BACnetPropertyType["propPackageComponentVersions"] = 12049] = "propPackageComponentVersions";
    BACnetPropertyType[BACnetPropertyType["propProvisioningStatus"] = 12052] = "propProvisioningStatus";
    BACnetPropertyType[BACnetPropertyType["propProvisioningProgress"] = 12053] = "propProvisioningProgress";
    BACnetPropertyType[BACnetPropertyType["propApplicationSwRevision"] = 12056] = "propApplicationSwRevision";
    BACnetPropertyType[BACnetPropertyType["propDisableAccessControl"] = 12059] = "propDisableAccessControl";
    BACnetPropertyType[BACnetPropertyType["propDatalinkComStatistics"] = 12156] = "propDatalinkComStatistics";
    BACnetPropertyType[BACnetPropertyType["propSaBusPerformance"] = 12157] = "propSaBusPerformance";
    BACnetPropertyType[BACnetPropertyType["propSaBusAverageTokenLoopTime"] = 12158] = "propSaBusAverageTokenLoopTime";
    BACnetPropertyType[BACnetPropertyType["propSaBusCovRcvPerMinute"] = 12159] = "propSaBusCovRcvPerMinute";
    BACnetPropertyType[BACnetPropertyType["propSaBusWritesPerMinute"] = 12160] = "propSaBusWritesPerMinute";
    BACnetPropertyType[BACnetPropertyType["propUseOccupancySchedule"] = 12161] = "propUseOccupancySchedule";
    BACnetPropertyType[BACnetPropertyType["propEquipmentTypeSet"] = 12167] = "propEquipmentTypeSet";
    BACnetPropertyType[BACnetPropertyType["propSystemSubtype"] = 12168] = "propSystemSubtype";
    BACnetPropertyType[BACnetPropertyType["propSystemSubtypeSet"] = 12169] = "propSystemSubtypeSet";
    BACnetPropertyType[BACnetPropertyType["propScheduleReferences"] = 12194] = "propScheduleReferences";
    BACnetPropertyType[BACnetPropertyType["propJciOutOfServiceReference"] = 12201] = "propJciOutOfServiceReference";
    BACnetPropertyType[BACnetPropertyType["propJciOutOfServiceValueRefer"] = 12202] = "propJciOutOfServiceValueRefer";
    BACnetPropertyType[BACnetPropertyType["propTestStatus"] = 30033] = "propTestStatus";
    BACnetPropertyType[BACnetPropertyType["propArchiveObject"] = 30034] = "propArchiveObject";
    BACnetPropertyType[BACnetPropertyType["propInformation"] = 30079] = "propInformation";
    BACnetPropertyType[BACnetPropertyType["propAverageIdle"] = 30080] = "propAverageIdle";
    BACnetPropertyType[BACnetPropertyType["propLastIdleSample"] = 30082] = "propLastIdleSample";
    BACnetPropertyType[BACnetPropertyType["propTraceEnabled"] = 30083] = "propTraceEnabled";
    BACnetPropertyType[BACnetPropertyType["propManufacturer"] = 30090] = "propManufacturer";
    BACnetPropertyType[BACnetPropertyType["propDeviceClass"] = 30091] = "propDeviceClass";
    BACnetPropertyType[BACnetPropertyType["propDeviceSubclass"] = 30092] = "propDeviceSubclass";
    BACnetPropertyType[BACnetPropertyType["propTransceiver"] = 30093] = "propTransceiver";
    BACnetPropertyType[BACnetPropertyType["propInstantShutdown"] = 30094] = "propInstantShutdown";
    BACnetPropertyType[BACnetPropertyType["propMulticastResponder"] = 30095] = "propMulticastResponder";
    BACnetPropertyType[BACnetPropertyType["propRouteBroadcasts"] = 30096] = "propRouteBroadcasts";
    BACnetPropertyType[BACnetPropertyType["propMaxApduLengthAccepted"] = 30097] = "propMaxApduLengthAccepted";
    BACnetPropertyType[BACnetPropertyType["propPagerDiagnostics"] = 30100] = "propPagerDiagnostics";
    BACnetPropertyType[BACnetPropertyType["propOccupancy"] = 32087] = "propOccupancy";
    BACnetPropertyType[BACnetPropertyType["propOutdoorAirTemp"] = 32092] = "propOutdoorAirTemp";
    BACnetPropertyType[BACnetPropertyType["propRemoteReliability"] = 32518] = "propRemoteReliability";
    BACnetPropertyType[BACnetPropertyType["propRemoteDescription"] = 32519] = "propRemoteDescription";
    BACnetPropertyType[BACnetPropertyType["propState"] = 32520] = "propState";
    BACnetPropertyType[BACnetPropertyType["propArchiveName"] = 32521] = "propArchiveName";
    BACnetPropertyType[BACnetPropertyType["propContractNumber"] = 32522] = "propContractNumber";
    BACnetPropertyType[BACnetPropertyType["propCreatedBy"] = 32523] = "propCreatedBy";
    BACnetPropertyType[BACnetPropertyType["propSamplesOverwritten"] = 32524] = "propSamplesOverwritten";
    BACnetPropertyType[BACnetPropertyType["propUseAbsoluteStartTime"] = 32525] = "propUseAbsoluteStartTime";
    BACnetPropertyType[BACnetPropertyType["propUseAbsoluteEndTime"] = 32526] = "propUseAbsoluteEndTime";
    BACnetPropertyType[BACnetPropertyType["propObjectReference"] = 32527] = "propObjectReference";
    BACnetPropertyType[BACnetPropertyType["propSerialPortCableConfig"] = 32528] = "propSerialPortCableConfig";
    BACnetPropertyType[BACnetPropertyType["propInternalModemConfig"] = 32529] = "propInternalModemConfig";
    BACnetPropertyType[BACnetPropertyType["propExternalModemConfig"] = 32530] = "propExternalModemConfig";
    BACnetPropertyType[BACnetPropertyType["propComputerName"] = 32531] = "propComputerName";
    BACnetPropertyType[BACnetPropertyType["propCompletionDomains"] = 32532] = "propCompletionDomains";
    BACnetPropertyType[BACnetPropertyType["propObtainDnsAddressAutomatical"] = 32533] = "propObtainDnsAddressAutomatical";
    BACnetPropertyType[BACnetPropertyType["propDnsServerIpAddresses"] = 32534] = "propDnsServerIpAddresses";
    BACnetPropertyType[BACnetPropertyType["propPagerDialupConfig"] = 32535] = "propPagerDialupConfig";
    BACnetPropertyType[BACnetPropertyType["propXmsDialupConfig"] = 32536] = "propXmsDialupConfig";
    BACnetPropertyType[BACnetPropertyType["propSmtpServerHost"] = 32537] = "propSmtpServerHost";
    BACnetPropertyType[BACnetPropertyType["propSmtpPort"] = 32538] = "propSmtpPort";
    BACnetPropertyType[BACnetPropertyType["propPopServerHostname"] = 32539] = "propPopServerHostname";
    BACnetPropertyType[BACnetPropertyType["propPopUserName"] = 32540] = "propPopUserName";
    BACnetPropertyType[BACnetPropertyType["propPopPassword"] = 32541] = "propPopPassword";
    BACnetPropertyType[BACnetPropertyType["propFailedDeliveryEmailAddress"] = 32542] = "propFailedDeliveryEmailAddress";
    BACnetPropertyType[BACnetPropertyType["propAlarmRepositorySize"] = 32543] = "propAlarmRepositorySize";
    BACnetPropertyType[BACnetPropertyType["propAlarmSnoozeTime"] = 32544] = "propAlarmSnoozeTime";
    BACnetPropertyType[BACnetPropertyType["propAuditRepositorySize"] = 32545] = "propAuditRepositorySize";
    BACnetPropertyType[BACnetPropertyType["propDialUpAuditForwardingThres"] = 32546] = "propDialUpAuditForwardingThres";
    BACnetPropertyType[BACnetPropertyType["propAuditActionWhenFull"] = 32547] = "propAuditActionWhenFull";
    BACnetPropertyType[BACnetPropertyType["propAuditGenerateAlarmWhenFull"] = 32548] = "propAuditGenerateAlarmWhenFull";
    BACnetPropertyType[BACnetPropertyType["propEnabledAuditLevel"] = 32549] = "propEnabledAuditLevel";
    BACnetPropertyType[BACnetPropertyType["propPowerSamplingInterval"] = 32550] = "propPowerSamplingInterval";
    BACnetPropertyType[BACnetPropertyType["propPowerConsecutiveSamples"] = 32551] = "propPowerConsecutiveSamples";
    BACnetPropertyType[BACnetPropertyType["propSnmpEnabled"] = 32552] = "propSnmpEnabled";
    BACnetPropertyType[BACnetPropertyType["propSnmpManagementDevice"] = 32553] = "propSnmpManagementDevice";
    BACnetPropertyType[BACnetPropertyType["propContactPerson"] = 32554] = "propContactPerson";
    BACnetPropertyType[BACnetPropertyType["propPublicCommunityName"] = 32555] = "propPublicCommunityName";
    BACnetPropertyType[BACnetPropertyType["propPrivateCommunityName"] = 32556] = "propPrivateCommunityName";
    BACnetPropertyType[BACnetPropertyType["propLocalSiteDirector"] = 32557] = "propLocalSiteDirector";
    BACnetPropertyType[BACnetPropertyType["propAdsRepository"] = 32558] = "propAdsRepository";
    BACnetPropertyType[BACnetPropertyType["propAdsConnectionType"] = 32559] = "propAdsConnectionType";
    BACnetPropertyType[BACnetPropertyType["propAdsDeliveryTime"] = 32560] = "propAdsDeliveryTime";
    BACnetPropertyType[BACnetPropertyType["propCheckInInterval"] = 32561] = "propCheckInInterval";
    BACnetPropertyType[BACnetPropertyType["propMaxMissedCheckIns"] = 32562] = "propMaxMissedCheckIns";
    BACnetPropertyType[BACnetPropertyType["propDeviceGoneInterval"] = 32563] = "propDeviceGoneInterval";
    BACnetPropertyType[BACnetPropertyType["propLanStatus"] = 32564] = "propLanStatus";
    BACnetPropertyType[BACnetPropertyType["propPagerDialUpStatus"] = 32565] = "propPagerDialUpStatus";
    BACnetPropertyType[BACnetPropertyType["propAdsDialUpStatus"] = 32566] = "propAdsDialUpStatus";
    BACnetPropertyType[BACnetPropertyType["propIncomingStatus"] = 32567] = "propIncomingStatus";
    BACnetPropertyType[BACnetPropertyType["propEmailDda"] = 32568] = "propEmailDda";
    BACnetPropertyType[BACnetPropertyType["propPagerDda"] = 32569] = "propPagerDda";
    BACnetPropertyType[BACnetPropertyType["propSnmpDda"] = 32570] = "propSnmpDda";
    BACnetPropertyType[BACnetPropertyType["propSecurityLevel"] = 32571] = "propSecurityLevel";
    BACnetPropertyType[BACnetPropertyType["propDeviceTimeServers"] = 32572] = "propDeviceTimeServers";
    BACnetPropertyType[BACnetPropertyType["propTimeSyncPeriod"] = 32573] = "propTimeSyncPeriod";
    BACnetPropertyType[BACnetPropertyType["propDefaultAdsRepository"] = 32574] = "propDefaultAdsRepository";
    BACnetPropertyType[BACnetPropertyType["propDefaultAdsConnectionType"] = 32575] = "propDefaultAdsConnectionType";
    BACnetPropertyType[BACnetPropertyType["propDefaultAdsDeliveryTime"] = 32576] = "propDefaultAdsDeliveryTime";
    BACnetPropertyType[BACnetPropertyType["propBacnetSite"] = 32577] = "propBacnetSite";
    BACnetPropertyType[BACnetPropertyType["propBacnetEncodingType"] = 32578] = "propBacnetEncodingType";
    BACnetPropertyType[BACnetPropertyType["propPublicSiteServerHostname"] = 32579] = "propPublicSiteServerHostname";
    BACnetPropertyType[BACnetPropertyType["propRouteToMetasys"] = 32580] = "propRouteToMetasys";
    BACnetPropertyType[BACnetPropertyType["propGraphic"] = 32581] = "propGraphic";
    BACnetPropertyType[BACnetPropertyType["propDefaultLanguage"] = 32582] = "propDefaultLanguage";
    BACnetPropertyType[BACnetPropertyType["propSiteTimeServers"] = 32584] = "propSiteTimeServers";
    BACnetPropertyType[BACnetPropertyType["propDatabaseEncryption"] = 32585] = "propDatabaseEncryption";
    BACnetPropertyType[BACnetPropertyType["propMappedObjectType"] = 32586] = "propMappedObjectType";
    BACnetPropertyType[BACnetPropertyType["propInstanceNumber"] = 32589] = "propInstanceNumber";
    BACnetPropertyType[BACnetPropertyType["propThirdPartyBbmds"] = 32591] = "propThirdPartyBbmds";
    BACnetPropertyType[BACnetPropertyType["propDriverName"] = 32592] = "propDriverName";
    BACnetPropertyType[BACnetPropertyType["propNeuronId"] = 32593] = "propNeuronId";
    BACnetPropertyType[BACnetPropertyType["propDomainId"] = 32594] = "propDomainId";
    BACnetPropertyType[BACnetPropertyType["propLnsDatabaseName"] = 32595] = "propLnsDatabaseName";
    BACnetPropertyType[BACnetPropertyType["propResourceFileLanguage"] = 32596] = "propResourceFileLanguage";
    BACnetPropertyType[BACnetPropertyType["propFileFilter"] = 32597] = "propFileFilter";
    BACnetPropertyType[BACnetPropertyType["propTransmitErrors"] = 32598] = "propTransmitErrors";
    BACnetPropertyType[BACnetPropertyType["propTransactionTimeouts"] = 32599] = "propTransactionTimeouts";
    BACnetPropertyType[BACnetPropertyType["propReceiveTransactionFull"] = 32600] = "propReceiveTransactionFull";
    BACnetPropertyType[BACnetPropertyType["propLostMessages"] = 32601] = "propLostMessages";
    BACnetPropertyType[BACnetPropertyType["propMissedMessages"] = 32602] = "propMissedMessages";
    BACnetPropertyType[BACnetPropertyType["propResetCause"] = 32603] = "propResetCause";
    BACnetPropertyType[BACnetPropertyType["propNodeState"] = 32604] = "propNodeState";
    BACnetPropertyType[BACnetPropertyType["propNeuronModel"] = 32605] = "propNeuronModel";
    BACnetPropertyType[BACnetPropertyType["propProgramId"] = 32606] = "propProgramId";
    BACnetPropertyType[BACnetPropertyType["propLocationLabel"] = 32607] = "propLocationLabel";
    BACnetPropertyType[BACnetPropertyType["propLocalControl"] = 32608] = "propLocalControl";
    BACnetPropertyType[BACnetPropertyType["propTreeOrdinalNumber"] = 32609] = "propTreeOrdinalNumber";
    BACnetPropertyType[BACnetPropertyType["propCustomScaleOffset"] = 32610] = "propCustomScaleOffset";
    BACnetPropertyType[BACnetPropertyType["propMigrateObjectConfiguration"] = 32611] = "propMigrateObjectConfiguration";
    BACnetPropertyType[BACnetPropertyType["propMigrateTrendConfiguration"] = 32613] = "propMigrateTrendConfiguration";
    BACnetPropertyType[BACnetPropertyType["propMigrateTotalizationConfigura"] = 32614] = "propMigrateTotalizationConfigura";
    BACnetPropertyType[BACnetPropertyType["propMigrateSchedules"] = 32615] = "propMigrateSchedules";
    BACnetPropertyType[BACnetPropertyType["propSynchronizeTime"] = 32616] = "propSynchronizeTime";
    BACnetPropertyType[BACnetPropertyType["propVersionNumber"] = 32617] = "propVersionNumber";
    BACnetPropertyType[BACnetPropertyType["propDsn_1"] = 32618] = "propDsn_1";
    BACnetPropertyType[BACnetPropertyType["propDsn_2"] = 32619] = "propDsn_2";
    BACnetPropertyType[BACnetPropertyType["propPrinterDda"] = 32621] = "propPrinterDda";
    BACnetPropertyType[BACnetPropertyType["propSnmpVersion"] = 32622] = "propSnmpVersion";
    BACnetPropertyType[BACnetPropertyType["propGraphicAlias"] = 32623] = "propGraphicAlias";
    BACnetPropertyType[BACnetPropertyType["propTimeSyncMethod"] = 32624] = "propTimeSyncMethod";
    BACnetPropertyType[BACnetPropertyType["propMulticastGroupAddress"] = 32625] = "propMulticastGroupAddress";
    BACnetPropertyType[BACnetPropertyType["propMulticastUdpPort"] = 32626] = "propMulticastUdpPort";
    BACnetPropertyType[BACnetPropertyType["propMulticastTtl"] = 32627] = "propMulticastTtl";
    BACnetPropertyType[BACnetPropertyType["propMulticastHeartbeatInterval"] = 32628] = "propMulticastHeartbeatInterval";
    BACnetPropertyType[BACnetPropertyType["propEthernetEnabled"] = 32629] = "propEthernetEnabled";
    BACnetPropertyType[BACnetPropertyType["propDisplayObjectGeneratedAudit"] = 32631] = "propDisplayObjectGeneratedAudit";
    BACnetPropertyType[BACnetPropertyType["propIncomingAuditRate"] = 32632] = "propIncomingAuditRate";
    BACnetPropertyType[BACnetPropertyType["propAuditsLost"] = 32634] = "propAuditsLost";
    BACnetPropertyType[BACnetPropertyType["propAuditsLostAttributeReset"] = 32635] = "propAuditsLostAttributeReset";
    BACnetPropertyType[BACnetPropertyType["propReliabilityTimeInterval"] = 32636] = "propReliabilityTimeInterval";
    BACnetPropertyType[BACnetPropertyType["propEnableApplicationGeneratedA"] = 32637] = "propEnableApplicationGeneratedA";
    BACnetPropertyType[BACnetPropertyType["propSiteSecurityLevel"] = 32645] = "propSiteSecurityLevel";
    BACnetPropertyType[BACnetPropertyType["propCertificateRenewalPeriod"] = 32646] = "propCertificateRenewalPeriod";
    BACnetPropertyType[BACnetPropertyType["propAllowHttp"] = 32647] = "propAllowHttp";
    BACnetPropertyType[BACnetPropertyType["propAutoResetTime"] = 32653] = "propAutoResetTime";
    BACnetPropertyType[BACnetPropertyType["propAdvancedSecurityEnabled"] = 32654] = "propAdvancedSecurityEnabled";
    BACnetPropertyType[BACnetPropertyType["propEmailEnabled"] = 32662] = "propEmailEnabled";
    BACnetPropertyType[BACnetPropertyType["propPrinterEnabled"] = 32663] = "propPrinterEnabled";
    BACnetPropertyType[BACnetPropertyType["propTrendStudy"] = 32664] = "propTrendStudy";
    BACnetPropertyType[BACnetPropertyType["propRankDefaultTrendHigher"] = 32665] = "propRankDefaultTrendHigher";
    BACnetPropertyType[BACnetPropertyType["propAuthenticatedWithSite"] = 32666] = "propAuthenticatedWithSite";
    BACnetPropertyType[BACnetPropertyType["propApplicationName"] = 50006] = "propApplicationName";
    BACnetPropertyType[BACnetPropertyType["propClassId"] = 50012] = "propClassId";
    BACnetPropertyType[BACnetPropertyType["propEffectiveOccupancy"] = 50032] = "propEffectiveOccupancy";
    BACnetPropertyType[BACnetPropertyType["propFlowSetpoint"] = 50060] = "propFlowSetpoint";
    BACnetPropertyType[BACnetPropertyType["propHardwareVersion"] = 50062] = "propHardwareVersion";
    BACnetPropertyType[BACnetPropertyType["propHeatCoolMode"] = 50063] = "propHeatCoolMode";
    BACnetPropertyType[BACnetPropertyType["propHeatingMaxFlow"] = 50071] = "propHeatingMaxFlow";
    BACnetPropertyType[BACnetPropertyType["propInputType"] = 50086] = "propInputType";
    BACnetPropertyType[BACnetPropertyType["propMaxHeatingSetpoint"] = 50100] = "propMaxHeatingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propMaxNonvolMemory"] = 50102] = "propMaxNonvolMemory";
    BACnetPropertyType[BACnetPropertyType["propMinCoolingSetpoint"] = 50107] = "propMinCoolingSetpoint";
    BACnetPropertyType[BACnetPropertyType["propOccupancySchedule"] = 50208] = "propOccupancySchedule";
    BACnetPropertyType[BACnetPropertyType["propOccupancySensor"] = 50209] = "propOccupancySensor";
    BACnetPropertyType[BACnetPropertyType["propOccupancyStatus"] = 50210] = "propOccupancyStatus";
    BACnetPropertyType[BACnetPropertyType["propOutputStatus"] = 50214] = "propOutputStatus";
    BACnetPropertyType[BACnetPropertyType["propPickupGain_2"] = 50215] = "propPickupGain_2";
    BACnetPropertyType[BACnetPropertyType["propSummerChangeLimit"] = 50240] = "propSummerChangeLimit";
    BACnetPropertyType[BACnetPropertyType["propSummerSetpoint"] = 50241] = "propSummerSetpoint";
    BACnetPropertyType[BACnetPropertyType["propWinterChangeLimit"] = 50251] = "propWinterChangeLimit";
    BACnetPropertyType[BACnetPropertyType["propWinterSetpoint"] = 50252] = "propWinterSetpoint";
    BACnetPropertyType[BACnetPropertyType["propBypassTime"] = 50302] = "propBypassTime";
    BACnetPropertyType[BACnetPropertyType["propProvisioningState"] = 50312] = "propProvisioningState";
    BACnetPropertyType[BACnetPropertyType["propDmcsVersionsCheck"] = 50350] = "propDmcsVersionsCheck";
    BACnetPropertyType[BACnetPropertyType["propInvokedClassesAndMethods"] = 50351] = "propInvokedClassesAndMethods";
    BACnetPropertyType[BACnetPropertyType["propSabpStatus"] = 50360] = "propSabpStatus";
    BACnetPropertyType[BACnetPropertyType["propSabpPkgrepoStatus"] = 50361] = "propSabpPkgrepoStatus";
    BACnetPropertyType[BACnetPropertyType["propSdpState"] = 50362] = "propSdpState";
    BACnetPropertyType[BACnetPropertyType["propSdpStatus"] = 50363] = "propSdpStatus";
    BACnetPropertyType[BACnetPropertyType["propProvisioningFiles"] = 50364] = "propProvisioningFiles";
    BACnetPropertyType[BACnetPropertyType["propInhibitProvisioningView"] = 50366] = "propInhibitProvisioningView";
    BACnetPropertyType[BACnetPropertyType["propProvisioningViewChangeCount"] = 50367] = "propProvisioningViewChangeCount";
    BACnetPropertyType[BACnetPropertyType["prop_62000"] = 62000] = "prop_62000";
    BACnetPropertyType[BACnetPropertyType["prop_62001"] = 62001] = "prop_62001";
    BACnetPropertyType[BACnetPropertyType["prop_62002"] = 62002] = "prop_62002";
    BACnetPropertyType[BACnetPropertyType["prop_62003"] = 62003] = "prop_62003";
    BACnetPropertyType[BACnetPropertyType["prop_62004"] = 62004] = "prop_62004";
    BACnetPropertyType[BACnetPropertyType["prop_62005"] = 62005] = "prop_62005";
    BACnetPropertyType[BACnetPropertyType["prop_62006"] = 62006] = "prop_62006";
    BACnetPropertyType[BACnetPropertyType["prop_62007"] = 62007] = "prop_62007";
    BACnetPropertyType[BACnetPropertyType["prop_62009"] = 62009] = "prop_62009";
    BACnetPropertyType[BACnetPropertyType["prop_62010"] = 62010] = "prop_62010";
    BACnetPropertyType[BACnetPropertyType["prop_62013"] = 62013] = "prop_62013";
    BACnetPropertyType[BACnetPropertyType["prop_62016"] = 62016] = "prop_62016";
    BACnetPropertyType[BACnetPropertyType["prop_62017"] = 62017] = "prop_62017";
    BACnetPropertyType[BACnetPropertyType["prop_62019"] = 62019] = "prop_62019";
    BACnetPropertyType[BACnetPropertyType["prop_62020"] = 62020] = "prop_62020";
    BACnetPropertyType[BACnetPropertyType["prop_62023"] = 62023] = "prop_62023";
    BACnetPropertyType[BACnetPropertyType["prop_62024"] = 62024] = "prop_62024";
    BACnetPropertyType[BACnetPropertyType["prop_62025"] = 62025] = "prop_62025";
    BACnetPropertyType[BACnetPropertyType["prop_62026"] = 62026] = "prop_62026";
    BACnetPropertyType[BACnetPropertyType["prop_62027"] = 62027] = "prop_62027";
    BACnetPropertyType[BACnetPropertyType["prop_62028"] = 62028] = "prop_62028";
    BACnetPropertyType[BACnetPropertyType["prop_62029"] = 62029] = "prop_62029";
    BACnetPropertyType[BACnetPropertyType["prop_62030"] = 62030] = "prop_62030";
    BACnetPropertyType[BACnetPropertyType["prop_62031"] = 62031] = "prop_62031";
    BACnetPropertyType[BACnetPropertyType["prop_62034"] = 62034] = "prop_62034";
    BACnetPropertyType[BACnetPropertyType["prop_62035"] = 62035] = "prop_62035";
    BACnetPropertyType[BACnetPropertyType["prop_62036"] = 62036] = "prop_62036";
    BACnetPropertyType[BACnetPropertyType["prop_62037"] = 62037] = "prop_62037";
    BACnetPropertyType[BACnetPropertyType["prop_62038"] = 62038] = "prop_62038";
    BACnetPropertyType[BACnetPropertyType["prop_62039"] = 62039] = "prop_62039";
    BACnetPropertyType[BACnetPropertyType["prop_62040"] = 62040] = "prop_62040";
    BACnetPropertyType[BACnetPropertyType["prop_62041"] = 62041] = "prop_62041";
    BACnetPropertyType[BACnetPropertyType["prop_62042"] = 62042] = "prop_62042";
    BACnetPropertyType[BACnetPropertyType["prop_62043"] = 62043] = "prop_62043";
    BACnetPropertyType[BACnetPropertyType["prop_62044"] = 62044] = "prop_62044";
    BACnetPropertyType[BACnetPropertyType["prop_62045"] = 62045] = "prop_62045";
    BACnetPropertyType[BACnetPropertyType["prop_62046"] = 62046] = "prop_62046";
    BACnetPropertyType[BACnetPropertyType["prop_62047"] = 62047] = "prop_62047";
    BACnetPropertyType[BACnetPropertyType["prop_62048"] = 62048] = "prop_62048";
    BACnetPropertyType[BACnetPropertyType["prop_62049"] = 62049] = "prop_62049";
    BACnetPropertyType[BACnetPropertyType["prop_62050"] = 62050] = "prop_62050";
    BACnetPropertyType[BACnetPropertyType["prop_62051"] = 62051] = "prop_62051";
    BACnetPropertyType[BACnetPropertyType["prop_62052"] = 62052] = "prop_62052";
    BACnetPropertyType[BACnetPropertyType["prop_62053"] = 62053] = "prop_62053";
    BACnetPropertyType[BACnetPropertyType["prop_62054"] = 62054] = "prop_62054";
    BACnetPropertyType[BACnetPropertyType["prop_62055"] = 62055] = "prop_62055";
    BACnetPropertyType[BACnetPropertyType["prop_62056"] = 62056] = "prop_62056";
    BACnetPropertyType[BACnetPropertyType["prop_62057"] = 62057] = "prop_62057";
    BACnetPropertyType[BACnetPropertyType["prop_62058"] = 62058] = "prop_62058";
    BACnetPropertyType[BACnetPropertyType["prop_62059"] = 62059] = "prop_62059";
    BACnetPropertyType[BACnetPropertyType["prop_62060"] = 62060] = "prop_62060";
    BACnetPropertyType[BACnetPropertyType["prop_62061"] = 62061] = "prop_62061";
    BACnetPropertyType[BACnetPropertyType["prop_62062"] = 62062] = "prop_62062";
    BACnetPropertyType[BACnetPropertyType["prop_62063"] = 62063] = "prop_62063";
    BACnetPropertyType[BACnetPropertyType["prop_62064"] = 62064] = "prop_62064";
    BACnetPropertyType[BACnetPropertyType["prop_62065"] = 62065] = "prop_62065";
    BACnetPropertyType[BACnetPropertyType["prop_62066"] = 62066] = "prop_62066";
    BACnetPropertyType[BACnetPropertyType["prop_62067"] = 62067] = "prop_62067";
    BACnetPropertyType[BACnetPropertyType["prop_62068"] = 62068] = "prop_62068";
    BACnetPropertyType[BACnetPropertyType["prop_62069"] = 62069] = "prop_62069";
    BACnetPropertyType[BACnetPropertyType["propActive"] = 63001] = "propActive";
    BACnetPropertyType[BACnetPropertyType["propAutoUpdate"] = 63009] = "propAutoUpdate";
    BACnetPropertyType[BACnetPropertyType["propControlMode"] = 63226] = "propControlMode";
    BACnetPropertyType[BACnetPropertyType["propCurrentStage"] = 63232] = "propCurrentStage";
    BACnetPropertyType[BACnetPropertyType["propLanguage"] = 63262] = "propLanguage";
    BACnetPropertyType[BACnetPropertyType["propStep"] = 63426] = "propStep";
    BACnetPropertyType[BACnetPropertyType["propFlowUnits"] = 63464] = "propFlowUnits";
    BACnetPropertyType[BACnetPropertyType["propLowPressure"] = 63591] = "propLowPressure";
    BACnetPropertyType[BACnetPropertyType["propManualControl"] = 63631] = "propManualControl";
    BACnetPropertyType[BACnetPropertyType["propManualDisableSw"] = 63632] = "propManualDisableSw";
    BACnetPropertyType[BACnetPropertyType["propBoolean_0"] = 63736] = "propBoolean_0";
    BACnetPropertyType[BACnetPropertyType["propFloat_0"] = 63747] = "propFloat_0";
    BACnetPropertyType[BACnetPropertyType["propOffDueToAlarm"] = 63766] = "propOffDueToAlarm";
    BACnetPropertyType[BACnetPropertyType["propOptimalStartStatus"] = 63767] = "propOptimalStartStatus";
    BACnetPropertyType[BACnetPropertyType["propRelativeHumidity"] = 63845] = "propRelativeHumidity";
    BACnetPropertyType[BACnetPropertyType["propRetryCounter"] = 63853] = "propRetryCounter";
    BACnetPropertyType[BACnetPropertyType["propRetryCounterLimit"] = 63854] = "propRetryCounterLimit";
    BACnetPropertyType[BACnetPropertyType["propRetryWaitTime"] = 63855] = "propRetryWaitTime";
    BACnetPropertyType[BACnetPropertyType["propGlobalCalendarObjectReferen"] = 63914] = "propGlobalCalendarObjectReferen";
    BACnetPropertyType[BACnetPropertyType["propServiceTime"] = 63926] = "propServiceTime";
    BACnetPropertyType[BACnetPropertyType["propStartInitDone"] = 63946] = "propStartInitDone";
    BACnetPropertyType[BACnetPropertyType["propStartupTime"] = 63947] = "propStartupTime";
    BACnetPropertyType[BACnetPropertyType["propTimeToOccupancy"] = 63971] = "propTimeToOccupancy";
    BACnetPropertyType[BACnetPropertyType["propValuesRead"] = 63991] = "propValuesRead";
    BACnetPropertyType[BACnetPropertyType["propSynchronizeTimeZone"] = 64003] = "propSynchronizeTimeZone";
    BACnetPropertyType[BACnetPropertyType["propCanSynchronizeTimeZone"] = 64004] = "propCanSynchronizeTimeZone";
    BACnetPropertyType[BACnetPropertyType["propAllowCalendarEdit"] = 64005] = "propAllowCalendarEdit";
    BACnetPropertyType[BACnetPropertyType["propNumberOfRejectedEvents"] = 64006] = "propNumberOfRejectedEvents";
    BACnetPropertyType[BACnetPropertyType["propNumberOfUnmappedEvents"] = 64007] = "propNumberOfUnmappedEvents";
    BACnetPropertyType[BACnetPropertyType["propNumberOfIgnoredEvents"] = 64008] = "propNumberOfIgnoredEvents";
    BACnetPropertyType[BACnetPropertyType["propNumberOfAcceptedEvents"] = 64009] = "propNumberOfAcceptedEvents";
    BACnetPropertyType[BACnetPropertyType["propProcessIdList"] = 64010] = "propProcessIdList";
    BACnetPropertyType[BACnetPropertyType["propStatesTextErrorStatus"] = 64022] = "propStatesTextErrorStatus";
    BACnetPropertyType[BACnetPropertyType["propAckForwardEnable"] = 64025] = "propAckForwardEnable";
    BACnetPropertyType[BACnetPropertyType["propManualTimeSyncType"] = 64030] = "propManualTimeSyncType";
    BACnetPropertyType[BACnetPropertyType["propLastUploadTime"] = 64031] = "propLastUploadTime";
    BACnetPropertyType[BACnetPropertyType["propLastUploadDate"] = 64032] = "propLastUploadDate";
    BACnetPropertyType[BACnetPropertyType["propExpression"] = 64037] = "propExpression";
    BACnetPropertyType[BACnetPropertyType["propTokenList"] = 64038] = "propTokenList";
    BACnetPropertyType[BACnetPropertyType["propSelectorEnabled"] = 64040] = "propSelectorEnabled";
    BACnetPropertyType[BACnetPropertyType["propMonitorType"] = 64041] = "propMonitorType";
    BACnetPropertyType[BACnetPropertyType["propHardwareReset"] = 64042] = "propHardwareReset";
    BACnetPropertyType[BACnetPropertyType["propNetworkReset"] = 64043] = "propNetworkReset";
    BACnetPropertyType[BACnetPropertyType["propStartDelay"] = 64044] = "propStartDelay";
    BACnetPropertyType[BACnetPropertyType["propEventLimit"] = 64045] = "propEventLimit";
    BACnetPropertyType[BACnetPropertyType["propEventInterval"] = 64046] = "propEventInterval";
    BACnetPropertyType[BACnetPropertyType["propEventCountNn"] = 64047] = "propEventCountNn";
    BACnetPropertyType[BACnetPropertyType["propStateNn"] = 64048] = "propStateNn";
    BACnetPropertyType[BACnetPropertyType["propRemainingCustomSets"] = 64049] = "propRemainingCustomSets";
    BACnetPropertyType[BACnetPropertyType["propRemainingAutoSets"] = 64050] = "propRemainingAutoSets";
    BACnetPropertyType[BACnetPropertyType["propEnumSetMemoryUsed"] = 64051] = "propEnumSetMemoryUsed";
    BACnetPropertyType[BACnetPropertyType["propEnumSetTotalMemoryUsed"] = 64052] = "propEnumSetTotalMemoryUsed";
    BACnetPropertyType[BACnetPropertyType["propNetworkValue"] = 64579] = "propNetworkValue";
    BACnetPropertyType[BACnetPropertyType["propNumberOfMapperCreateFailur"] = 64583] = "propNumberOfMapperCreateFailur";
    BACnetPropertyType[BACnetPropertyType["propProcessUnmappedObjectAlarms"] = 64584] = "propProcessUnmappedObjectAlarms";
    BACnetPropertyType[BACnetPropertyType["propInitialReadComplete"] = 64585] = "propInitialReadComplete";
    BACnetPropertyType[BACnetPropertyType["propIntervalFactor"] = 64587] = "propIntervalFactor";
    BACnetPropertyType[BACnetPropertyType["propSslEmailEnabled"] = 64590] = "propSslEmailEnabled";
    BACnetPropertyType[BACnetPropertyType["propSslEmailIgnoringErrors"] = 64591] = "propSslEmailIgnoringErrors";
    BACnetPropertyType[BACnetPropertyType["propFilteredProcessVariable"] = 64592] = "propFilteredProcessVariable";
    BACnetPropertyType[BACnetPropertyType["propAccountId"] = 64595] = "propAccountId";
    BACnetPropertyType[BACnetPropertyType["propAccountPassword"] = 64596] = "propAccountPassword";
    BACnetPropertyType[BACnetPropertyType["propAuthenticationServiceEndPoi"] = 64597] = "propAuthenticationServiceEndPoi";
    BACnetPropertyType[BACnetPropertyType["propRemoteServicesConnectionEnd"] = 64598] = "propRemoteServicesConnectionEnd";
    BACnetPropertyType[BACnetPropertyType["propConnectionStatus"] = 64599] = "propConnectionStatus";
    BACnetPropertyType[BACnetPropertyType["propProxyAddress"] = 64601] = "propProxyAddress";
    BACnetPropertyType[BACnetPropertyType["propProxyPortNumber"] = 64602] = "propProxyPortNumber";
    BACnetPropertyType[BACnetPropertyType["propProxyUsername"] = 64603] = "propProxyUsername";
    BACnetPropertyType[BACnetPropertyType["propProxyPassword"] = 64604] = "propProxyPassword";
    BACnetPropertyType[BACnetPropertyType["propRegistrationUsage"] = 64605] = "propRegistrationUsage";
    BACnetPropertyType[BACnetPropertyType["propDataUsage"] = 64606] = "propDataUsage";
    BACnetPropertyType[BACnetPropertyType["propDataCollectionRate"] = 64607] = "propDataCollectionRate";
    BACnetPropertyType[BACnetPropertyType["propConnectionPollRate"] = 64614] = "propConnectionPollRate";
    BACnetPropertyType[BACnetPropertyType["propProxyErrorCount"] = 64615] = "propProxyErrorCount";
    BACnetPropertyType[BACnetPropertyType["propMaskSslCertificateErrors"] = 64648] = "propMaskSslCertificateErrors";
    BACnetPropertyType[BACnetPropertyType["propInternalData"] = 64664] = "propInternalData";
    BACnetPropertyType[BACnetPropertyType["propConnectionEnabled"] = 64670] = "propConnectionEnabled";
    BACnetPropertyType[BACnetPropertyType["propApplicationKey"] = 64672] = "propApplicationKey";
    BACnetPropertyType[BACnetPropertyType["propRemoteDevicesInformation"] = 64684] = "propRemoteDevicesInformation";
    BACnetPropertyType[BACnetPropertyType["propRoomCoolingDemand"] = 64692] = "propRoomCoolingDemand";
    BACnetPropertyType[BACnetPropertyType["propRoomHeatingDemand"] = 64693] = "propRoomHeatingDemand";
    BACnetPropertyType[BACnetPropertyType["propUseOccupiedSetpoints"] = 64694] = "propUseOccupiedSetpoints";
    BACnetPropertyType[BACnetPropertyType["propEwmaCounter"] = 64695] = "propEwmaCounter";
    BACnetPropertyType[BACnetPropertyType["propNumberOfStandardDeviations"] = 64696] = "propNumberOfStandardDeviations";
    BACnetPropertyType[BACnetPropertyType["propCoolingWeightingParameter_1"] = 64697] = "propCoolingWeightingParameter_1";
    BACnetPropertyType[BACnetPropertyType["propCoolingWeightingParameter_2"] = 64699] = "propCoolingWeightingParameter_2";
    BACnetPropertyType[BACnetPropertyType["propHeatingWeightingParameter_1"] = 64700] = "propHeatingWeightingParameter_1";
    BACnetPropertyType[BACnetPropertyType["propHeatingWeightingParameter_2"] = 64701] = "propHeatingWeightingParameter_2";
    BACnetPropertyType[BACnetPropertyType["propEwmaCoolingDemand"] = 64702] = "propEwmaCoolingDemand";
    BACnetPropertyType[BACnetPropertyType["propEwmaHeatingDemand"] = 64703] = "propEwmaHeatingDemand";
    BACnetPropertyType[BACnetPropertyType["propCoolingEwma"] = 64704] = "propCoolingEwma";
    BACnetPropertyType[BACnetPropertyType["propHeatingEwma"] = 64705] = "propHeatingEwma";
    BACnetPropertyType[BACnetPropertyType["propCorrectedReturnTime"] = 64706] = "propCorrectedReturnTime";
    BACnetPropertyType[BACnetPropertyType["propUncorrectedReturnTime"] = 64707] = "propUncorrectedReturnTime";
    BACnetPropertyType[BACnetPropertyType["propWarmupOrCooldownStartTime"] = 64708] = "propWarmupOrCooldownStartTime";
    BACnetPropertyType[BACnetPropertyType["propWarmupOrCooldownStopTime"] = 64709] = "propWarmupOrCooldownStopTime";
    BACnetPropertyType[BACnetPropertyType["propWarmupOrCooldownStartTempe"] = 64710] = "propWarmupOrCooldownStartTempe";
    BACnetPropertyType[BACnetPropertyType["propWarmupOrCooldownStopTemper"] = 64711] = "propWarmupOrCooldownStopTemper";
    BACnetPropertyType[BACnetPropertyType["propSyslogDda"] = 64720] = "propSyslogDda";
    BACnetPropertyType[BACnetPropertyType["propForceUpstage"] = 64723] = "propForceUpstage";
    BACnetPropertyType[BACnetPropertyType["propForceDownstage"] = 64724] = "propForceDownstage";
    BACnetPropertyType[BACnetPropertyType["propFirstSetOnDelay"] = 64725] = "propFirstSetOnDelay";
    BACnetPropertyType[BACnetPropertyType["propSolenoidValveOut"] = 64726] = "propSolenoidValveOut";
    BACnetPropertyType[BACnetPropertyType["propOilPumpOut"] = 64727] = "propOilPumpOut";
    BACnetPropertyType[BACnetPropertyType["propRemaining"] = 64728] = "propRemaining";
    BACnetPropertyType[BACnetPropertyType["propNextDeviceToStart"] = 64729] = "propNextDeviceToStart";
    BACnetPropertyType[BACnetPropertyType["propNextDeviceToStop"] = 64730] = "propNextDeviceToStop";
    BACnetPropertyType[BACnetPropertyType["propInterstageTimeRemaining"] = 64731] = "propInterstageTimeRemaining";
    BACnetPropertyType[BACnetPropertyType["propStabilizeTimeRemaining"] = 64732] = "propStabilizeTimeRemaining";
    BACnetPropertyType[BACnetPropertyType["propInterstageTimingMethod"] = 64733] = "propInterstageTimingMethod";
    BACnetPropertyType[BACnetPropertyType["propInvertStagesInSets"] = 64734] = "propInvertStagesInSets";
    BACnetPropertyType[BACnetPropertyType["propEqualRuntimeWithinSets"] = 64735] = "propEqualRuntimeWithinSets";
    BACnetPropertyType[BACnetPropertyType["propCalculateMakeBreakLimits"] = 64736] = "propCalculateMakeBreakLimits";
    BACnetPropertyType[BACnetPropertyType["propPumpDownAvailable"] = 64737] = "propPumpDownAvailable";
    BACnetPropertyType[BACnetPropertyType["propOilPumpOnDevice_1"] = 64738] = "propOilPumpOnDevice_1";
    BACnetPropertyType[BACnetPropertyType["propOilPumpOnDelay"] = 64739] = "propOilPumpOnDelay";
    BACnetPropertyType[BACnetPropertyType["propOilPumpOffDelay"] = 64740] = "propOilPumpOffDelay";
    BACnetPropertyType[BACnetPropertyType["propRotateNowDelay"] = 64741] = "propRotateNowDelay";
    BACnetPropertyType[BACnetPropertyType["propInstantShutdownDelay"] = 64742] = "propInstantShutdownDelay";
    BACnetPropertyType[BACnetPropertyType["propPreset"] = 64744] = "propPreset";
    BACnetPropertyType[BACnetPropertyType["propSyslogReportingEnabled"] = 64745] = "propSyslogReportingEnabled";
    BACnetPropertyType[BACnetPropertyType["propInternalLoad"] = 64746] = "propInternalLoad";
    BACnetPropertyType[BACnetPropertyType["propInterstageDelayOnRotate"] = 64747] = "propInterstageDelayOnRotate";
    BACnetPropertyType[BACnetPropertyType["propOverrideExpirationTime"] = 64786] = "propOverrideExpirationTime";
    BACnetPropertyType[BACnetPropertyType["propOutOfServiceExpirationTime"] = 64787] = "propOutOfServiceExpirationTime";
    BACnetPropertyType[BACnetPropertyType["propRegion"] = 64788] = "propRegion";
    BACnetPropertyType[BACnetPropertyType["propIoControllerFailure"] = 64812] = "propIoControllerFailure";
    BACnetPropertyType[BACnetPropertyType["propIoControllerResetCount"] = 64813] = "propIoControllerResetCount";
    BACnetPropertyType[BACnetPropertyType["propIoControllerReset"] = 64814] = "propIoControllerReset";
    BACnetPropertyType[BACnetPropertyType["propIoControllerFailureCount"] = 64815] = "propIoControllerFailureCount";
    BACnetPropertyType[BACnetPropertyType["propEffectiveStrokeTimeInaccura"] = 64816] = "propEffectiveStrokeTimeInaccura";
    BACnetPropertyType[BACnetPropertyType["propCalculatedStrokeTime"] = 64817] = "propCalculatedStrokeTime";
    BACnetPropertyType[BACnetPropertyType["knxPort"] = 64886] = "knxPort";
    BACnetPropertyType[BACnetPropertyType["knxConnectionString"] = 64887] = "knxConnectionString";
    BACnetPropertyType[BACnetPropertyType["knxAddress"] = 64888] = "knxAddress";
    BACnetPropertyType[BACnetPropertyType["knxDataType"] = 64889] = "knxDataType";
    BACnetPropertyType[BACnetPropertyType["propDeviceObjectIdentifier"] = 65530] = "propDeviceObjectIdentifier";
    BACnetPropertyType[BACnetPropertyType["propSequenceRowControl"] = 65531] = "propSequenceRowControl";
    BACnetPropertyType[BACnetPropertyType["propPmiRefresh"] = 65534] = "propPmiRefresh";
    BACnetPropertyType[BACnetPropertyType["maxBacnetPropertyId"] = 65535] = "maxBacnetPropertyId";
    BACnetPropertyType[BACnetPropertyType["propNodeId"] = 64896] = "propNodeId";
    BACnetPropertyType[BACnetPropertyType["proOpcuaAccessLevel"] = 64897] = "proOpcuaAccessLevel";
})(BACnetPropertyType || (BACnetPropertyType = {}));
;
const BacnetPropertyTranslationMap = {
    0: () => t('已确认的转换'),
    1: () => t('需要确认'),
    2: () => t('行动'),
    3: () => t('操作文本'),
    4: () => t('活动文本'),
    5: () => t('活动室性心动过速会话'),
    6: () => t('报警值{bacproperty6}', {}),
    7: () => t('报警值{bacproperty7}', {}),
    8: () => t('全部'),
    9: () => t('写入成功'),
    10: () => t('APDU分段超时'),
    11: () => t('APDU超时'),
    12: () => t('应用软件版本'),
    13: () => t('存档'),
    14: () => t('偏差'),
    15: () => t('COS计数'),
    16: () => t('COS时间'),
    17: () => t('通知类'),
    19: () => t('受控变量参考'),
    20: () => t('受控变量单位'),
    21: () => t('受控变量值'),
    22: () => t('COV 增量'),
    23: () => t('日期列表'),
    24: () => t('夏令时状态'),
    25: () => t('BACnet死区'),
    26: () => t('导数常数'),
    27: () => t('衍生合约单位'),
    28: () => t('描述'),
    29: () => t('停止说明'),
    30: () => t('设备Addr绑定'),
    31: () => t('设备类型'),
    32: () => t('有效期'),
    33: () => t('活动时间已过'),
    34: () => t('错误限制'),
    35: () => t('事件启用'),
    36: () => t('事件状态'),
    37: () => t('事件类型'),
    38: () => t('其他计划'),
    39: () => t('故障值'),
    40: () => t('反馈值'),
    41: () => t('文件访问方法'),
    42: () => t('文件大小'),
    43: () => t('文件类型'),
    44: () => t('固件版本'),
    45: () => t('上限'),
    46: () => t('非活动文本'),
    47: () => t('进行中{bacproperty47}', {}),
    48: () => t('实例'),
    49: () => t('积分常数'),
    50: () => t('整体结构单元'),
    52: () => t('限制启用'),
    53: () => t('组成员列表'),
    54: () => t('属性引用列表'),
    55: () => t('已删除'),
    56: () => t('当地日期'),
    57: () => t('当地时间'),
    58: () => t('位置'),
    59: () => t('下限'),
    60: () => t('操纵变量引用'),
    61: () => t('最大输出'),
    62: () => t('最大 APDU 长度'),
    63: () => t('最大信息帧'),
    64: () => t('最大主控'),
    65: () => t('最大值{bacproperty65}', {}),
    66: () => t('最小关闭时间'),
    67: () => t('最小准时'),
    68: () => t('最小输出'),
    69: () => t('最小值{bacproperty69}', {}),
    70: () => t('模块名称'),
    71: () => t('修改日期'),
    72: () => t('通知类型'),
    73: () => t('APDU重试'),
    74: () => t('状态数'),
    75: () => t('对象标识'),
    76: () => t('对象列表{bacproperty76}', {}),
    77: () => t('对象原始名称'),
    78: () => t('对象属性参考'),
    79: () => t('对象类型'),
    81: () => t('中止服务'),
    82: () => t('输出单位'),
    83: () => t('事件参数'),
    84: () => t('极性'),
    85: () => t('当前值'),
    86: () => t('优先级'),
    87: () => t('优先级阵列'),
    88: () => t('写操作优先级'),
    89: () => t('进程标识'),
    90: () => t('程序更改'),
    91: () => t('程序位置'),
    92: () => t('程序状态'),
    93: () => t('比例构成'),
    94: () => t('支撑常数单位'),
    96: () => t('协议对象支持'),
    97: () => t('协议序列支持'),
    98: () => t('协议版本'),
    99: () => t('只读'),
    100: () => t('暂停原因'),
    102: () => t('收件人列表'),
    103: () => t('可靠性'),
    104: () => t('默认值'),
    106: () => t('精度'),
    107: () => t('分段'),
    108: () => t('设定点'),
    109: () => t('设定点参考'),
    110: () => t('状态文本'),
    111: () => t('状态标志'),
    112: () => t('系统状态'),
    113: () => t('时间延迟'),
    114: () => t('活动时间重置'),
    115: () => t('状态计数重置'),
    116: () => t('时间同步收件人'),
    117: () => t('单位'),
    118: () => t('更新间隔'),
    119: () => t('UTC偏移量'),
    120: () => t('供应商编号'),
    121: () => t('供应商名称'),
    122: () => t('支持VT类'),
    123: () => t('每周计划'),
    124: () => t('尝试的样本'),
    125: () => t('平均值'),
    126: () => t('缓存大小'),
    127: () => t('客户COV增量'),
    128: () => t('COV复苏间隔'),
    130: () => t('活动时间戳'),
    131: () => t('日志缓冲区'),
    132: () => t('输入参考'),
    133: () => t('启用'),
    134: () => t('日志间隔'),
    135: () => t('最大值{bacproperty135}', {}),
    136: () => t('最小值{bacproperty136}', {}),
    137: () => t('通知阈值'),
    139: () => t('协议修订'),
    140: () => t('通知后的记录'),
    141: () => t('记录条数'),
    142: () => t('开始时间'),
    143: () => t('停止时间'),
    144: () => t('存满是否停止'),
    145: () => t('总记录条数'),
    146: () => t('有效样本'),
    147: () => t('窗口间隔'),
    148: () => t('窗口示例'),
    149: () => t('最大值时间戳'),
    150: () => t('最小值时间戳'),
    152: () => t('主动COV订阅'),
    153: () => t('备份失败超时'),
    154: () => t('配置文件'),
    155: () => t('数据库修订'),
    156: () => t('直接阅读'),
    157: () => t('上次恢复时间'),
    158: () => t('需要维护'),
    159: () => t('成员'),
    160: () => t('生命安全模式'),
    161: () => t('预期操作'),
    162: () => t('设置'),
    163: () => t('静音'),
    164: () => t('跟踪值'),
    165: () => t('区域成员'),
    166: () => t('生命安全报警值'),
    167: () => t('可接受最大分段'),
    168: () => t('配置文件名称'),
    173: () => t('上次通知记录'),
    174: () => t('默认计划命令'),
    175: () => t('接受模式'),
    176: () => t('递减现值'),
    177: () => t('脉冲计数'),
    178: () => t('递减前计数'),
    179: () => t('计数更改时间'),
    180: () => 'COV',
    181: () => t('脉冲参考'),
    182: () => t('极限监测间隔'),
    183: () => t('记录对象引用'),
    184: () => t('日志记录'),
    185: () => t('预缩放'),
    186: () => t('脉搏率'),
    187: () => t('比例'),
    188: () => t('脉冲比例因子'),
    189: () => t('更新时间'),
    190: () => t('更改前的值'),
    191: () => t('值集'),
    192: () => t('值更改时间'),
    193: () => t('对齐间隔'),
    195: () => t('间隔偏移'),
    196: () => t('上次重新启动原因'),
    197: () => t('记录类型'),
    202: () => t('重新启动通知收件人'),
    203: () => t('设备重启时间'),
    204: () => t('时间同步间隔'),
    205: () => t('触发器'),
    206: () => t('UTC时间同步收件人'),
    212: () => t('实际棚位'),
    213: () => t('值班窗口'),
    214: () => t('预期棚位'),
    215: () => t('满负荷基线'),
    218: () => t('请求的棚屋级别'),
    219: () => t('棚持续时间'),
    220: () => t('棚屋级别描述'),
    221: () => t('棚层'),
    222: () => t('状态描述'),
    260: () => t('身份验证状态'),
    295: () => t('占用率下限_已执行'),
    296: () => t('占用状态'),
    338: () => t('备份和还原状态'),
    339: () => t('备份准备时间'),
    340: () => t('恢复完成时间'),
    341: () => t('恢复准备时间'),
    342: () => t('位掩码'),
    343: () => t('位文本'),
    344: () => t('是UTC'),
    351: () => t('事件消息文本'),
    352: () => t('事件消息文本配置'),
    353: () => t('启用事件检测'),
    368: () => t('执行延迟'),
    369: () => t('最后优先级'),
    370: () => t('写入状态'),
    371: () => t('属性列表'),
    373: () => t('闪烁警告启用'),
    374: () => t('默认衰减时间'),
    375: () => t('默认斜坡率'),
    376: () => t('默认步长增量'),
    377: () => t('出口时间'),
    378: () => t('进行中{bacproperty378}', {}),
    379: () => t('瞬时功率'),
    380: () => t('照明命令'),
    381: () => t('照明命令默认优先级'),
    382: () => t('最大实际值'),
    383: () => t('最小实际值'),
    384: () => t('功率'),
    385: () => t('过渡'),
    386: () => t('出口活动'),
    399: () => t('APDU 长度'),
    400: () => t('IP地址'),
    401: () => t('IP默认网关'),
    402: () => t('启用IP DHCP'),
    406: () => t('IP DNS服务器'),
    408: () => t('BACnet IP模式'),
    411: () => t('IP子网掩码'),
    412: () => t('BACnet IP UDP端口'),
    413: () => t('BBMD接受F.D.注册'),
    414: () => t('BBMD广播分布表'),
    415: () => t('BBMD外部设备表'),
    416: () => t('更改待定'),
    417: () => t('命令'),
    420: () => t('链路速度'),
    422: () => t('链路速度自动协商'),
    423: () => t('MAC地址'),
    425: () => t('网络号'),
    426: () => t('网络号质量'),
    427: () => t('网络类型'),
    431: () => t('当前命令优先级'),
    482: () => t('协议级别'),
    512: () => t('状态'),
    541: () => t('广播已禁用'),
    547: () => t('时间'),
    548: () => t('日期'),
    708: () => t('报警计数'),
    720: () => t('远程对象引用'),
    750: () => t('主机名'),
    797: () => t('XPlatform对象类型'),
    803: () => t('树修订'),
    813: () => t('默认'),
    814: () => t('所有项目进行更新中'),
    824: () => t('采样率'),
    847: () => t('XPlatform系统状态'),
    849: () => t('存档日期'),
    850: () => t('存档时间'),
    858: () => t('XPlatform存储库状态'),
    862: () => t('投票率'),
    864: () => t('网络容差'),
    867: () => t('运输故障率'),
    868: () => t('最大间歇故障期'),
    869: () => t('平均间歇故障期'),
    902: () => t('文件名'),
    908: () => t('授权类别'),
    1122: () => t('登录前横幅文本'),
    1123: () => t('登录横幅超时时间'),
    1134: () => t('以太网 MAC 地址'),
    1138: () => t('DHCP已启用'),
    1290: () => t('最后已知时间戳'),
    1403: () => t('时区'),
    1480: () => t('传出事件率'),
    1481: () => t('传入事件率'),
    1528: () => t('在线存档传输中'),
    1730: () => t('警告横幅'),
    2058: () => t('站点数据'),
    2336: () => t('DNS刷新期'),
    2390: () => t('名称'),
    2534: () => t('趋势开始日期'),
    2535: () => t('结束日期'),
    2547: () => t('对象列表{bacproperty2547}', {}),
    2548: () => t('结束时间'),
    2577: () => t('设备引用'),
    2585: () => t('默认XPlatform优先级阈值'),
    2588: () => t('动态广播管理'),
    3060: () => t('类型'),
    3814: () => t('认证类型'),
    4271: () => t('已验证'),
    4821: () => t('发动机报告数量'),
    6047: () => t('公共广播'),
    6049: () => t('服务设备'),
    10000: () => t('item定义ID'),
    10001: () => t('Item内部ID'),
    10002: () => t('网络路径'),
    10003: () => t('关联点位网络路径'),
    10004: () => t('上级节点网络路径'),
    10005: () => t('上级节点设备网络路径'),
    10006: () => t('关联点位清单'),
    10007: () => t('Cron Action系列表'),
    10008: () => t('数据类型'),
    10009: () => t('日程表清单'),
    10010: () => t('容量指标电路'),
    30079: () => t('信息'),
    32521: () => t('存档名称'),
    32522: () => t('合同编号'),
    32523: () => t('创建者'),
    32527: () => t('项目参考'),
    32544: () => t('闹钟休眠时间'),
    32549: () => t('已启用的审核级别'),
    32557: () => t('本地站点主管'),
    32563: () => t('设备消失间隔'),
    32571: () => t('服务安全'),
    32572: () => t('设备时间服务器'),
    32573: () => t('时间同步周期'),
    32574: () => t('默认XPlatform存储库'),
    32575: () => t('默认XPlatform连接类型'),
    32576: () => t('默认XPlatform交付时间'),
    32577: () => t('BACnet站点'),
    32578: () => t('BACnet编码类型'),
    32579: () => t('公共站点服务器主机名'),
    32581: () => t('图形'),
    32582: () => t('默认语言'),
    32583: () => t('默认时区'),
    32584: () => t('站点时间服务器'),
    32585: () => t('数据库加密'),
    32624: () => t('时间同步方法'),
    32625: () => t('多播组地址'),
    32626: () => t('多播UDP端口'),
    32627: () => t('多播TTL'),
    32628: () => t('多播心跳间隔'),
    32632: () => t('传入审核率'),
    32645: () => t('站点安全级别'),
    32646: () => t('证书续订期'),
    32654: () => t('已启用高级安全'),
    32664: () => t('趋势研究'),
    63926: () => t('服务时间'),
    64049: () => t('剩余自定义集'),
    64050: () => t('剩余自动设置'),
    64051: () => t('枚举集内存已使用'),
    64052: () => t('枚举集已用总内存'),
    64595: () => t('账号'),
    64596: () => t('账号密码'),
    64605: () => t('注册使用情况'),
    64606: () => t('数据使用情况'),
    64607: () => t('数据收集率'),
    64670: () => t('连接已启用'),
    64818: () => t('仪表板'),
    64819: () => t('标签'),
    64820: () => t('IP端口'),
    64821: () => t('组ID'),
    64822: () => t('相机'),
    64823: () => 'KNX',
    64824: () => t('摄像头墙'),
    64825: () => t('布局'),
    64886: () => t('端口'),
    64887: () => t('连接字符串'),
    64888: () => t('地址'),
    64889: () => t('类型'),
    64892: () => t('Modbus地址'),
    64893: () => t('寄存器类型'),
    64894: () => t('寄存器地址'),
    64896: () => t('nodeId'),
    64897: () => t('AccessLevel'),
};
export default BacnetPropertyTranslationMap;
//# sourceMappingURL=bacnetPropertyType.js.map