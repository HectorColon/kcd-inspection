import { Injectable } from "@angular/core";
import { CarInspection } from "../shared/models/carInspection.model";
import '../../assets/js/smtp.js';
import { ToastrService } from "ngx-toastr";
import { termsAndConditions } from "../shared/models/constants/terms-and-conditions.const";
declare let Email: any;
import * as _moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    termsAndConditions = termsAndConditions;
    inspectionDate: string;
    inspectionDateTime: string;

    constructor(private _ngxToastrService: ToastrService) { }

    sendEmail(carInspection: CarInspection): void {
        let date = _moment(new Date(carInspection.dateTime.replace('T', ' '))).locale('es');
        this.inspectionDate = date.format('LL');
        this.inspectionDateTime = _moment(new Date(carInspection.dateTime.replace('T', ' '))).format('h:mm:ss a');

        Email.send({
            Host: 'smtp.elasticemail.com',
            Port: 2525,
            Username: 'kathycarwashanddetailing@gmail.com',
            Password: 'B684CD1EDC13E93B9A05C5C3611D2AA5374B',
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
                <link rel="icon" type="image/x-icon" href="favicon.ico">
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
                        <div> <img style="width: 200px;" src="https://i.postimg.cc/XXS4SXXW/Untitled-design-3.png"></div>
                        <strong>
                        <h2 style="margin-top: -32px;">Inspección</h2>
                        </strong>
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
                                    word-break: normal;">Fecha: <strong>${this.inspectionDate}</strong></td>
                    <td style="border-color: #000000; text-align: left; vertical-align: top border-color: black; border-style: solid;
                                    border-width: 1px;
                                    font-family: Arial, sans-serif;
                                    font-size: 14px;
                                    overflow: hidden;
                                    padding: 10px 5px;
                                    word-break: normal;">Hora: <strong>${this.inspectionDateTime}</strong></td>
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

                        <p>Café y agua gratuita que se otorga en la sala de espera se limita a 1 tasa o su equivalente por cliente, el “Car Wash” no se obliga a tener disponible esta cortesía.</p>

                        <p>Si algún cliente se comporta de manera agresiva el servicio se cancelará sin devolución al cliente.</p>

                        <p><strong>Acerca del COVID-19</strong></p>

                        <p><strong>Uso de mascarilla en el establecimiento es completamente obligatorio y mantener los 6 pies de distancia.</strong></p>

                        </div>
                        <div fxLayout="row">
                        <div>
                            <span style="border-bottom: 1px solid;">${carInspection.termsAndConditionAccepted ? '✓' : '𐄂'}</span>
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
} 