import { Inject, Injectable, LOCALE_ID } from "@angular/core";
import { CarInspection } from "../../shared/models/carInspection.model";
import '../../../assets/js/smtp.js';
import { ToastrService } from "ngx-toastr";
import { termsAndConditions } from "../../shared/models/constants/terms-and-conditions.const";
declare let Email: any;
import * as _moment from 'moment';
import { Quotation } from "src/app/shared/models/quotation.model";
import { Service } from "src/app/shared/models/service.model";
import { formatCurrency } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    termsAndConditions = termsAndConditions;
    inspectionDate: string;
    inspectionDateTime: string;

    constructor(private _ngxToastrService: ToastrService,
        @Inject(LOCALE_ID) public locale: string) { }

    sendEmail(carInspection: CarInspection): void {
        let date = _moment.isDate(carInspection.inspectionDate) ? _moment(carInspection.inspectionDate).locale('es') : _moment(carInspection.inspectionDate.toDate()).locale('es');
        let lFormat = date.format('LL');
        let hourFormat = _moment.isDate(carInspection.inspectionDate) ? _moment(carInspection.inspectionDate).format('h:mm:ss a') : date.format('h:mm:ss a');
       
        Email.send({
            Host: 'smtp.elasticemail.com',
            Port: 2525,
            Username: 'kathycarwashanddetailing@gmail.com',
            Password: 'C4BDDD75DE19BB453EA4C20F804B4142CB7D',
            To: carInspection.clientEmail,
            From: 'kathycarwashanddetailing@gmail.com',
            Subject: `Inspección Vehiculo de Motor | ${carInspection.clientFullName}`,
            Body: `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="utf-8">
                <title>Kathy's CarWash and Detailing</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    <style type="text/css">
                            width: 100% !important;
                    </style>
                </head>
                </html>
                <body>
                 <div fxLayout="row" fxLayoutAlign="end center" style="padding: 24px;">
            <div class="paper">
                <table style="border-collapse: collapse; border-spacing: 0;">
                <thead>
                    <tr>
                    <th colspan="2" style="text-align:center, border-color: #000000; vertical-align: top border-color: black;
                                    border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    font-weight: normal;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;">
                        <div> 
                        <img style="width: 200px;" src="https://i.postimg.cc/XXS4SXXW/Untitled-design-3.png" alt="img">
                        <p>
                        Carr. 132 Bo. Canas, Ponce P.R., al lado de la Iglesia Cristiana Tabernaculo,
                        (787) 472-9430
                        </p>
                        </div>
                        <div style="padding-top: 24px">
                            <strong>
                            <h2 style="margin-top: -32px;">Inspección</h2>
                            </strong>
                        </div>
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th colspan="2" style="background-color: #7BB9F2; border-color: #000000; text-align: left; vertical-align: top;   border-style: solid;
                                    border-width: 1px;"><strong>Información General</strong></th>
                    </tr>
                    <tr>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;">Fecha: <strong>${lFormat}</strong></td>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;">Hora: <strong>${hourFormat}</strong></td>
                    </tr>
                    <tr>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;">Nombre del Cliente: <span><strong>${carInspection.clientFullName}</strong></span></td>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;">Telefono: <span><strong>${carInspection.clientPhoneNumber}</strong></span></td>
                    </tr>
                    <tr>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;" colspan="2">Correo Electrónico:
                        <span><strong>${carInspection.clientEmail}</strong></span></td>
                    </tr>
                    <tr>
                    <td colspan="2" style="background-color: #7BB9F2; border-color: #000000; text-align: left; vertical-align: top; border-style: solid;
                                    border-width: 1px;"><strong>Inspección del Vehiculo</strong>
                    </td>
                    </tr>
                    <tr>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;" colspan="2">
                        <div style="padding-bottom: 8px; font-size: 12px;" fxLayout="row" fxLayoutAlign="space-between center">
                        <span><strong>Leyenda:</strong></span>
                        <br>
                        <span><strong>WS</strong> (“Water Spot”) | <strong>O</strong> (Oxidación) | <strong>DA</strong> (Daño
                            de
                            Aros) | <strong>R</strong> (Rayados) | <strong>CD</strong> (Clear Dañado) | <strong>CR</strong>
                            (Cristal
                            Roto) | <strong>C</strong> (Choque)</span>
                        </div>
                        <div fxLayout="column">
                        <div>
                            <img src="${carInspection.inspectionDrawing}" alt="img">
                        </div>
                        <div style="padding-bottom: 8px;">
                            <span><strong>Nota:</strong></span>
                        </div>
                        <div style="border-bottom: 1px solid;">
                            ${carInspection.inspectionNote}
                        </div>
                        </div>
                    </td>
                    </tr>
                    <tr>
                    <td colspan="2" style="background-color: #7BB9F2; border-color: #000000; text-align: left; vertical-align: top; border-style: solid;
                                    border-width: 1px;"><strong>Terminos y Condiciones</strong></td>
                    </tr>
                    <tr>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;" colspan="2">
                        <div style="font-size: 12px;">
                        <p><strong>Precios.</strong> Los precios de los paquetes y servicios que ofrece el “Car Wash” pueden cambiar sin aviso. No se fía ni se otorgan créditos. Pagos con ATH Móvil se deberá presentar evidencia del pago. Se paga antes de otorgar el servicio o el <strong>50%</strong> del mismo. No todas las formas de pago ofertadas por él “Car Wash” estarán disponibles en todo momento. <strong><em>Servicios de Cita Previa</em></strong> deberán pagar un deposito no reembolsable a la cita ya pautada, el porciento de este dependerá del servicio solicitado.</p>

                        <p><strong>Descripción</strong>. Los servicios ofertados por el “Car Wash”, no necesariamente corresponden con la descripción de dicho servicio, si por alguna razón no se pudiera dar el servicio completo se le otorgara al cliente un servicio por un valor equivalente al promocionado, si el cliente no lo desea; se le otorgara un cupón para canjearlo en otra fecha por la diferencia. “Car Wash” puede cambiar, modificar o cancelar sus servicios en cualquier momento.</p>

                        <p><strong>Horario.</strong> El horario publicado en la pagina de Facebook como en cartelones en el establecimiento no necesariamente será en forzado, puede el “Car Wash” cerrar el servicio sin previo aviso durante días festivos, fines de semana o cuando así convenga sus intereses. El horario regular se publica de la pagina de Facebook.</p>

                        <p><strong>Riesgos.</strong> El “Car Wash” utiliza maquinas a presión, agua, químicos y aspiradoras, El cliente deberá de tomar sus precauciones e informar al lavador de cualquier condición especial que tenga su automóvil.</p>

                        <p><strong>Áreas.</strong> El “Car Wash” ofrece área de espera además de el área de enjuagado y secado. Las áreas comunes del Car Wash son de uso exclusivo de sus empleados. Las áreas de mantenimiento y de trabajo están prohibidas para los clientes, estas áreas no siempre están marcadas.</p>

                        <p>Si el cliente llegara a tener algún accidente en estas áreas, el “Car Wash” y sus empleados no se hace responsable de los daños que este pudiera llegar a tener.</p>

                        <p><strong>Generalidades.</strong> El consumo de drogas y bebidas alcohólicas queda estrictamente prohibido y la administración se reserva el derecho de admisión. Niños menores de edad deberán de estar siempre acompañados por padres o supervisor.</p>

                        <p>No hay derecho de tanto ni preferencial a ningún cliente, el orden con el que lleguen será con el que serán atendidos. Cualquier daño que el cliente genere a las instalaciones de, el “Car Wash” será responsabilidad del cliente.</p>

                        <p>Café y agua gratuita que se otorga en la sala de espera se limita a 1 taza o su equivalente por cliente, el “Car Wash” no se obliga a tener disponible esta cortesía.</p>

                        <p>Si algún cliente se comporta de manera agresiva el servicio se cancelará sin devolución al cliente.</p>

                        <p><strong>Acerca del COVID-19</strong></p>

                        <p><strong>Uso de mascarilla en el establecimiento es completamente obligatorio y mantener los 6 pies de distancia.</strong></p>

                        </div>
                        <div fxLayout="row">
                        <div>
                            <span style="border-bottom: 1px solid;">${carInspection.termsAndConditionAccepted ? '✓' : 'x'}</span>
                            <span style="padding-left: 8px;">Aceptó términos y condiciones</span>
                        </div>
                        </div>
                    </td>
                    </tr>
                    <tr>
                    <td colspan="2" style="background-color: #7BB9F2; border-color: #000000; text-align: left; vertical-align: top; border-style: solid;
                                    border-width: 1px;"><strong><strong>Firma del Cliente</strong></strong>
                    </td>
                    </tr>
                    <tr>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px; 
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;" colspan="2">
                        <div fxLayout="row" fxLayoutAlign="start center">
                        X
                        <img src="${carInspection.clientSignature}" style="border-bottom: 1px solid;" alt="img">
                        </div>
                         <div style="padding-top: 16px">
                          <div>
                            El correo electrónico para hacer quejas y sugerencia será  <a href="mailto:kathycarwashanddetailing@gmail.com">kathycarwashanddetailing@gmail.com</a>
                        </div>
                        <div><a href="https://forms.gle/iWW5MQwEtkLx2GjXA">Encuesta de Satisfacción del Cliente</a></div>
                         </div>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
                </body>
            `
        }).then(message => {
            if (message === 'OK') {
                this._ngxToastrService.success('Inspección enviada correctamente');
            } else {
                this._ngxToastrService.error(message);
            }
        });
    }

    sendQuotationEmail(quotation: Quotation): void {
        // SUM TOTAL OF AMOUNTS
        let sum: number = 0;
        let sumFormatted: string;
        quotation.services.forEach(a => sum += a.amount);
        sumFormatted = formatCurrency(sum, this.locale,'$')

        Email.send({
            Host: 'smtp.elasticemail.com',
            Port: 2525,
            Username: 'kathycarwashanddetailing@gmail.com',
            Password: 'C4BDDD75DE19BB453EA4C20F804B4142CB7D',
            To: quotation.client.clientEmail,
            From: 'kathycarwashanddetailing@gmail.com',
            Subject: `Cotización | ${quotation.client.clientFullName}`,
            Body: `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="utf-8">
                <title>Kathy's CarWash and Detailing</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    <style type="text/css">
                            width: 100% !important;
                            .tg  {border-collapse:collapse;border-spacing:0; }
                            .tg td{font-family:Arial, sans-serif;font-size:14px;
                            overflow:hidden;padding:10px 5px;word-break:normal;}
                            .tg th{font-family:Arial, sans-serif;font-size:14px;
                            font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
                            .tg .tg-j1i3{border-color:inherit;position:-webkit-sticky;position:sticky;text-align:center;top:-1px;vertical-align:top;
                            will-change:transform}
                            .tg .tg-dvpl{border-color:inherit;text-align:right;vertical-align:top}
                            .tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
                            .tg .tg-0lax{text-align:left;vertical-align:top}
                    </style>
                </head>
                </html>
                <body>
                    <table class="tg">
                    <thead>
                    <tr>
                        <th class="tg-j1i3" colspan="4">
                            <div> 
                            <img style="width: 200px;" src="https://i.postimg.cc/XXS4SXXW/Untitled-design-3.png" alt="img">
                            <p>
                            Carr. 132 Bo. Canas, Ponce P.R., al lado de la Iglesia Cristiana Tabernaculo,
                            (787) 472-9430
                            </p>
                            </div>
                            <div style="padding-top: 24px">
                                <strong>
                                <h2 style="margin-top: -32px;">Cotización</h2>
                                </strong>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                     <tr>
                        <td class="tg-dvpl" colspan="4">
                        <span style="font-size: 14px; color: #1976d2">&nbsp; #${quotation.quotationNumber}</span>
                        </td>
                        </tr>
                        <tr>
                            <td class="tg-0pky">
                                <p>${quotation.client.clientFullName}</p>
                                <p>${quotation.client.clientPhoneNumber}</p>
                                <p>${quotation.client.clientEmail}</p>
                            </td>
                            <td class="tg-0lax"></td>
                            <td class="tg-0lax"></td>
                            <td class="tg-0lax">
                                <p>Fecha de Cotización: ${_moment(_moment.isDate(quotation.quotationDate) ? quotation.quotationDate : quotation.quotationDate.toDate()).format('MM/DD/YYYY')}</p>
                                <p>Valido por 14 días</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="tg-0lax" colspan="4">
                            <table style="width: 100%">
                        <thead>
                            <tr>
                                <th style="background-color: #1976d2; color: #ffffff">Descripción</th>
                                <th style="background-color: #1976d2; color: #ffffff">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.serviceTableGenerator(quotation.services)}
                            <tr>
                                <td style="text-align:left">
                                    <div fxLayout="row" fxLayoutAlign="end center">
                                        <span><strong>Total</strong></span>
                                    </div>
                                </td>
                                <td>
                                    <div fxLayout="row" fxLayoutAlign="end center">
                                        ${sumFormatted}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p style="color: #1976d2"><strong>Nota:</strong></p>
                                    <p>${quotation.quotationNote}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                            </td>
                        </tr>
                        <tr>
                            <td class="tg-0lax" colspan="4">
                             <div fxLayout="column" fxLayoutAlign="center center">
                        <div>
                            <p>Para poder separar tu espacio deberá llamar con al menos 24hrs de anticipación (Sujeto a
                                disponibilidad)</p>
                        </div>
                        <div>
                            <p>Trabajos serán comenzados a trabajar con un 50% del total adeudado en esta cotización</p>
                        </div>
                        <div>
                            <p>Gracias por su patrocinio</p>
                        </div>
                    </div>
                            </td>
                    </tr>
                    </tbody>
                    </table>
                </body>
            `
        }).then(message => {
            if (message === 'OK') {
                this._ngxToastrService.success('Cotización enviada correctamente');
            } else {
                this._ngxToastrService.error(message);
            }
        });
    }

    serviceTableGenerator(services: Service[]): string {
        let servicesTable = ``;

        services.forEach(s => {
            servicesTable += `
            <tr>
            <td>${s.service}</td>
            <td>
                <div fxLayout="row" fxLayoutAlign="end center">${formatCurrency(s.amount, this.locale, '$')}</div>
            </td>
            </tr>`
        });

        return servicesTable;
    }

} 