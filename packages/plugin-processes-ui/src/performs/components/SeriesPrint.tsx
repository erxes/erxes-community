import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import QRCode from 'react-qr-code';
import dayjs from 'dayjs';

//erxes
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils';

// local
import LeftSidebar from './SeriesPrintSidebar';
import { PrintableWrapper } from '../../styles';
import { SeriesPrintConfig, IPerform } from '../types';

type Props = {
  keyValue: string;
  perform: IPerform;
};

const BarcodeGenerator = (props: Props) => {
  const { keyValue, perform } = props;

  const configStored: SeriesPrintConfig = {
    ...{
      row: 1,
      column: 1,
      width: 80,
      height: 100,
      margin: 0,
      isProductName: true,
      productNameFontSize: 11,
      priceFontSize: 11,

      isBarcode: true,
      barWidth: 2,
      barHeight: 50,
      barcodeFontSize: 13,
      barcodeDescriptionFontSize: 8,

      isQrcode: true,
      qrSize: 128
    },
    ...JSON.parse(
      localStorage.getItem('erxes_perform_series_print_config') || '{}'
    )
  };

  // Hooks
  const [config, setConfig] = useState<SeriesPrintConfig>(configStored);
  const [printElement, setPrintElement] = useState<any>(null);

  useEffect(() => {
    // If config date is in the past
    // Make it today
    const configCopy = { ...config };

    localStorage.setItem(
      'erxes_perform_series_print_config',
      JSON.stringify(configCopy)
    );

    updatePrint();
  }, [config, perform]);

  // Functions
  const handleChangeConfig = (key: string, value: any) => {
    const configCopy = { ...config };
    configCopy[key] = value;
    setConfig(configCopy);
  };

  const updatePrint = () => {
    const iframeElement: any = document.getElementById('ifmcontentstoprint');
    const barcode: any = document.getElementById('barcode');
    const qrcode: any = document.getElementById('qrcode');

    let printContentHTML = '';

    printContentHTML += `
      <div style="
        display: flex;
        flex-direction: column;
        width: 100vw;
        align-items: center;
        justify-content: center;
        font-family: 'Arial';
      ">
    `;

    for (let index = 1; index <= config.row; index++) {
      // BarcodeRow
      printContentHTML += `<div style="
          display: flex;
          align-items: center;
          justify-content: center;
        ">`;

      for (let index = 1; index <= config.column; index++) {
        // BarcodeItem
        printContentHTML += `
          <div style="
            width: ${config.width}mm;
            height: ${config.height}mm;
            margin: ${config.margin}mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: white;
          ">`;

        if (config.isProductName) {
          printContentHTML += `
            <div style="
              width: 100%;
              text-align: center;
              font-size: ${config.productNameFontSize}px !important;
            ">
              ${perform.type && perform.type}
            </div>`;
        }

        if (config.isBarcode) {
          printContentHTML += barcode.innerHTML;
        }

        if (config.isQrcode) {
          printContentHTML += qrcode.innerHTML;
        }

        printContentHTML += `</div>`;
      }

      printContentHTML += `</div>`;
    }

    printContentHTML += `</div>`;

    iframeElement.contentWindow.document.body.innerHTML = printContentHTML;

    setPrintElement(iframeElement);
  };

  const handlePrint = () => {
    if (printElement) {
      printElement.contentWindow.focus();
      printElement.contentWindow.print();
    }
  };

  const title = perform ? perform.type : 'Unknown';

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Product & Service'), link: '/settings/perform-service' },
    { title, link: `/settings/perform-service/details/${perform._id}` },
    { title: __('Barcode Generator') }
  ];

  const content = (
    <>
      <PrintableWrapper id="barcodePrintable">
        <div id="barcode">
          <Barcode
            type="EAN13"
            value={`${keyValue}`}
            fontSize={config.barcodeFontSize}
            width={config.barWidth}
            height={config.barHeight}
          />
        </div>
        <div id="qrcode">
          <QRCode value={`${keyValue}`} size={config.qrSize} level="Q" />
        </div>
      </PrintableWrapper>
      <iframe
        id="ifmcontentstoprint"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          backgroundColor: '#F0F0F0'
        }}
      />
    </>
  );

  return (
    <Wrapper
      header={<Wrapper.Header title={title} breadcrumb={breadcrumb} />}
      leftSidebar={
        <LeftSidebar
          config={config}
          handleChangeConfig={handleChangeConfig}
          handlePrint={handlePrint}
        />
      }
      content={content}
      transparent={true}
    />
  );
};

export default BarcodeGenerator;
