export const getItemPropfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(ITEM_REFNUM_QUAL_GID,',') within group (order by ITEM_REFNUM_QUAL_GID) FROM ITEM_REFNUM_QUAL) REFNUMS, (SELECT listagg(ITEM_FEATURE_QUAL_GID,',') within group (order by ITEM_FEATURE_QUAL_GID) FROM ITEM_FEATURE_QUAL) ITEMFEATURES, (SELECT listagg(GTM_PROD_CLASS_TYPE_GID,',') within group (order by GTM_PROD_CLASS_TYPE_GID) FROM GTM_PROD_CLASS_TYPE) GTMITEMCLASSIFICATIONS, (SELECT listagg(GTM_LANGUAGE_GID ||'::'|| LANGUAGE_NAME,',') within group (order by GTM_LANGUAGE_GID ||'::'|| LANGUAGE_NAME) FROM GTM_LANGUAGE ) GTMITEMDESCRIPTIONS from dual
</Statement></Query></sql2xml>`;

export const getReleasePropsfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(ORDER_RELEASE_REFNUM_QUAL_GID,',') within group (order by ORDER_RELEASE_REFNUM_QUAL_GID) FROM ORDER_RELEASE_REFNUM_QUAL) RELEASE_REFNUMS, (SELECT listagg(OR_LINE_REFNUM_QUAL_GID,',') within group (order by OR_LINE_REFNUM_QUAL_GID) FROM ORDER_RELEASE_LINE_REFNUM_QUAL) RELEASE_lINE_REFNUMS, (SELECT listagg(INVOLVED_PARTY_QUAL_GID,',') within group (order by INVOLVED_PARTY_QUAL_GID) FROM INVOLVED_PARTY_QUAL) INVOLVED_PARTY, (SELECT listagg(ITEM_FEATURE_QUAL_GID,',') within group (order by ITEM_FEATURE_QUAL_GID) FROM ITEM_FEATURE_QUAL) lINE_ITEM_ATTRIBUTE from dual
</Statement></Query></sql2xml>`;

export const getLocationPropfromOtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(LOCATION_REFNUM_QUAL_GID,',') within group (order by LOCATION_REFNUM_QUAL_GID) FROM LOCATION_REFNUM_QUAL) REFNUMS from dual
</Statement></Query></sql2xml>`;

export const getBomPropsfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(GTM_STRUCTURE_REFNUM_QUAL_GID,',') within group (order by GTM_STRUCTURE_REFNUM_QUAL_GID) FROM GTM_STRUCTURE_REFNUM_QUAL) REFNUMS, (SELECT listagg(GTM_STR_COMP_REFNUM_QUAL_GID,',') within group (order by GTM_STR_COMP_REFNUM_QUAL_GID) FROM GTM_STR_COMPONENT_REFNUM_QUAL) COMPONENT_REFNUMS, (SELECT listagg(INVOLVED_PARTY_QUAL_GID,',') within group (order by INVOLVED_PARTY_QUAL_GID) FROM INVOLVED_PARTY_QUAL) INVOLVED_PARTY from dual
</Statement></Query></sql2xml>`;

export const getTransactionPropsfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (select listagg(DATE_QUALIFIER_GID, ',') within group (order by DATE_QUALIFIER_GID) from (select DATE_QUALIFIER_GID, sum(length(DATE_QUALIFIER_GID) + 2) over (order by DATE_QUALIFIER_GID) running_length from GTM_DATE_QUALIFIER) where running_length &lt; 4000) DATES, (select listagg(GTM_QUANTITY_TYPE_GID ||'['||TYPE||']' , ',') within group (order by GTM_QUANTITY_TYPE_GID) from GTM_QUANTITY_TYPE) QUANTITY,(select listagg(GTM_VALUE_QUALIFIER_GID, ',') within group (order by GTM_VALUE_QUALIFIER_GID) from (select GTM_VALUE_QUALIFIER_GID, sum(length(GTM_VALUE_QUALIFIER_GID) + 2) over (order by GTM_VALUE_QUALIFIER_GID) running_length from GTM_VALUE_QUALIFIER) where running_length &lt; 4000) CURRENCY,(SELECT listagg(GTM_TRANS_REFNUM_QUAL_GID,',') within group (order by GTM_TRANS_REFNUM_QUAL_GID) FROM GTM_TRANS_REFNUM_QUAL) GTMTRANS_REFNUMS, (SELECT listagg(GTM_TRANSLINE_REFNUM_QUAL_GID,',') within group (order by GTM_TRANSLINE_REFNUM_QUAL_GID) FROM GTM_TRANSLINE_REFNUM_QUAL) GTMTRANSACTION_lINE_REFNUMS, (SELECT listagg(INVOLVED_PARTY_QUAL_GID,',') within group (order by INVOLVED_PARTY_QUAL_GID) FROM INVOLVED_PARTY_QUAL) INVOLVED_PARTY,(SELECT listagg(CURRENCY_GID,',') within group (order by CURRENCY_GID) FROM CURRENCY) CURRENCY_UOM,(SELECT listagg(UOM_CODE||'['||TYPE||']',',') within group (order by UOM_CODE) FROM UOM where UOM_CODE in (select distinct UOM_CODE from GTM_TRANSACTION_QUANTITY)) QUANTITY_UOM from dual
</Statement></Query></sql2xml>`;

export const getPartyPropfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(GTM_PARTY_REFNUM_QUAL_GID,',') within group (order by GTM_PARTY_REFNUM_QUAL_GID) FROM GTM_PARTY_REFNUM_QUAL) CONTACT_REFNUMS from dual
</Statement></Query></sql2xml>`;

export const getOrderBasePropsfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(OB_REFNUM_QUAL_GID,',') within group (order by OB_REFNUM_QUAL_GID) FROM OB_REFNUM_QUAL) ORDER_BASE_REFNUMS, (SELECT listagg(OB_LINE_REFNUM_QUAL_GID,',') within group (order by OB_LINE_REFNUM_QUAL_GID) FROM OB_LINE_REFNUM_QUAL) OB_LINE_REFNUMS, (SELECT listagg(INVOLVED_PARTY_QUAL_GID,',') within group (order by INVOLVED_PARTY_QUAL_GID) FROM INVOLVED_PARTY_QUAL) INVOLVED_PARTY, (SELECT listagg(ITEM_FEATURE_QUAL_GID,',') within group (order by ITEM_FEATURE_QUAL_GID) FROM ITEM_FEATURE_QUAL) lINE_ITEM_ATTRIBUTE from dual
</Statement></Query></sql2xml>`;

export const getTrackingEventPropfromOtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(SELECT listagg(SHIPMENT_REFNUM_QUAL_GID,',') within group (order by SHIPMENT_REFNUM_QUAL_GID) FROM SHIPMENT_REFNUM_QUAL) REFNUMS from dual
</Statement></Query></sql2xml>`;

export const getShipmentPropsfromGtm = `<sql2xml><Query><RootName>GTM</RootName><Statement>
select(select listagg(REMARK_QUAL_GID, ',') within group (order by REMARK_QUAL_GID) from (select REMARK_QUAL_GID, sum(length(REMARK_QUAL_GID) + 2) over (order by REMARK_QUAL_GID) running_length from REMARK_QUAL) where running_length &lt; 4000) REMARKS, (SELECT listagg(SHIPMENT_REFNUM_QUAL_GID,',') within group (order by SHIPMENT_REFNUM_QUAL_GID) FROM SHIPMENT_REFNUM_QUAL) SHIPMENT_REFNUMS from dual
</Statement></Query></sql2xml>`;

export const getTransmissionStatus = (transmission, reProcess) => {
  return `<sql2xml>
    <Query>
      <RootName>
      TRANSACTION_STATUS
      </RootName>
      <Statement>
        select OBJECT_GID
          ,DATA_QUERY_TYPE_GID
          ,I_TRANSACTION_NO
          ,STATUS
        from i_transaction
        where ${reProcess ? 'I_TRANSACTION_NO' : 'I_TRANSMISSION_NO'}
          in ( ${transmission.join(',')} )
      </Statement>
    </Query>
  </sql2xml>`;
};
