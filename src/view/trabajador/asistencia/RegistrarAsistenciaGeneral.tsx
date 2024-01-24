import { useRef, useEffect, useState } from "react";
import RestError from "@/model/class/resterror.model.class";
import Response from "@/model/class/response.model.class";
import { Types } from "@/model/enum/types.model.enum";
import Listas from "@/model/interfaces/Listas.model.interface";
import RespValue from "@/model/interfaces/RespValue.model.interface";

import { InsertarAsistenciaHorarioAsignaturaFecha, InsertarAsistenciaHorarioEspecifico, ListarPreRegistroAsistencia } from "@/network/rest/idiomas.network";

import useSweerAlert from "@/component/hooks/useSweetAlert"
import { diaSelect } from "@/helper/herramienta.helper";
import toast from "react-hot-toast";
import AsistenciaCelda from "./componente/AsistenciaCelda";


type Props = {
    handleCloseModuloAsistencia: () => void;
    item: any
    idHorarioAsignatura: number
};


const RegistrarAsistenciaGeneral = (props: Props) => {

    //console.log(props.item)

    const codigo = JSON.parse(window.localStorage.getItem("codigo") || "");

    const abortController = useRef(new AbortController());

    const sweet = useSweerAlert();

    const [matriculadosAsig, setMatriculadoAsig] = useState<any[]>([])

    const [, setRegistrado] = useState(0)
    const [seleccionarTodos, setSeleccionarTodos] = useState<boolean>(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');

    //Mostra contenidos diferentes
    const [activeContent, setActiveContent] = useState<number | null>(1);

    const handleButtonClick = (contentNumber: number) => {
        setActiveContent(contentNumber);
    };

    useEffect(() => {
        EstudiantesMatriculados()
    }, [])

    const EstudiantesMatriculados = async () => {
        setMatriculadoAsig([])

        const response = await ListarPreRegistroAsistencia<Listas>(props.item.horarioAsigId, abortController.current)

        if (response instanceof Response) {

            const data = response.data.resultado as any[]

            let nuevoLista: any[] = [];

            let condicionRegistro = 0

            for (let j = 0; j < data.length; j++) {

                const item = data[j];

                let objeto: any = {

                    detMatriculaId: item.detMatriculaId,
                    estMaterno: item.estMaterno,
                    estNombres: item.estNombres,
                    estPaterno: item.estPaterno,
                    estudianteId: item.estudianteId,
                    sede: item.sede,
                    seleccionado: false,
                };

                nuevoLista.push(objeto);
            }

            setRegistrado(condicionRegistro)
            //
            setMatriculadoAsig(nuevoLista)

        }
        if (response instanceof RestError) {
            if (response.getType() === Types.CANCELED) return;
            console.log(response.getMessage())
        }
    }

    const registrarAsistenciaMasivo = async () => {
        // console.log(matriculadosAsig)
        if (activeContent == 3 && fechaSeleccionada == '') {
            toast.error("Tiene que seleccionar una fecha")
            return
        }

        sweet.openDialog("Mensaje", "¿Esta seguro de continuar", async (value) => {
            if (value) {

                //sweet.openInformation("Mensaje", "Procesando información...")

                let asistenciaRegistro: any[] = []

                matriculadosAsig.map((item) => {

                    const registro = {
                        "detMatriculaId": item.detMatriculaId,
                        "fechaAsistencia": fechaSeleccionada,
                        "estado": item.seleccionado,
                    }
                    asistenciaRegistro.push(registro)
                })

                //console.log(asistenciaRegistro)

                if (activeContent == 2) { //INSERTAR ASISTENCIA DE HOY
                    const response = await InsertarAsistenciaHorarioAsignaturaFecha<RespValue>(codigo, asistenciaRegistro, abortController.current)
                    if (response instanceof Response) {

                        const mensaje = response.data.value as string

                        if (mensaje == 'procesado') {

                            sweet.openSuccess("Mensaje", "Registros insertados correctamente", () => {
                                EstudiantesMatriculados()
                            });


                            //console.log('Se proceso')
                        } else {
                            sweet.openWarning("Mensaje", "Ocurrio un error al procesar la peticion", () => {
                            });

                            //console.log('No se proceso')
                        }
                    }
                    if (response instanceof RestError) {
                        if (response.getType() === Types.CANCELED) return;
                        //console.log(response)
                        sweet.openWarning("Mensaje", response.getMessage(), () => {
                        });
                    }
                }
                if (activeContent == 3) { //INSERTAR ASISTENCIA ESPECIFICO
                    const responseEspecifico = await InsertarAsistenciaHorarioEspecifico<RespValue>(codigo, asistenciaRegistro, abortController.current)

                    if (responseEspecifico instanceof Response) {

                        const mensajeEspec = responseEspecifico.data.value as string

                        if (mensajeEspec == 'procesado') {

                            sweet.openSuccess("Mensaje", "Registros insertados correctamente", () => {
                                EstudiantesMatriculados()
                            });


                            //console.log('Se proceso')
                        } else {
                            sweet.openWarning("Mensaje", "Ocurrio un error al procesar la peticion", () => {
                            });

                            //console.log('No se proceso')
                        }
                    }
                    if (responseEspecifico instanceof RestError) {
                        if (responseEspecifico.getType() === Types.CANCELED) return;
                        //console.log(responseEspecifico)
                        sweet.openWarning("Mensaje", responseEspecifico.getMessage(), () => {
                        });
                    }
                }

            }
        })

    }

    const handleCheckboxChange = (index: number) => {
        const nuevosMatriculados = [...matriculadosAsig];
        nuevosMatriculados[index].seleccionado = !nuevosMatriculados[index].seleccionado;
        setMatriculadoAsig(nuevosMatriculados);
    };

    const handleSeleccionarTodos = () => {
        setSeleccionarTodos(!seleccionarTodos);
        const nuevosMatriculados = matriculadosAsig.map((item) => ({
            ...item,
            seleccionado: !seleccionarTodos,
        }));
        setMatriculadoAsig(nuevosMatriculados);
    };

    const generarBody = () => {

        if (matriculadosAsig.length == 0) {
            return (
                <tr className="text-center bg-white border-b">
                    <td colSpan={5} className="text-sm p-2 border-b border-solid">No se encontraron registros</td>
                </tr>
            );
        }

        return matriculadosAsig.map((item, index) => {

            return (
                <tr key={index} className={`text-sm ${index % 2 == 0 ? 'bg-gray-100' : 'bg-white'}`}>
                    <td className="border p-2 px-4 text-center">{++index}</td>
                    <td className="border p-2 px-4 text-center">{item.estudianteId}</td>
                    <td className="border p-2 px-4">{`${item.estPaterno} ${item.estMaterno} ${item.estNombres}`}</td>
                    <td className="border p-2 px-4 text-center">{item.sede}</td>
                    {
                        activeContent != 1 &&
                        <td className={`border p-2 text-center  ${valorDiasEstado && 'bg-gray-100'}`}>
                            {
                                valorDiasEstado ?
                                    <span className="text-gray-400">-</span>
                                    :
                                    <input
                                        disabled={valorDiasEstado}
                                        type="checkbox"
                                        checked={item.seleccionado || false}
                                        onChange={() => handleCheckboxChange(index - 1)}
                                    />
                            }

                        </td>
                    }
                    {
                        activeContent == 1 &&
                        fechas.map((dia, index) => {


                            return (
                                <AsistenciaCelda
                                    key={index}
                                    codigo={item.estudianteId}
                                    fecha={dia.fechaString}
                                />
                            )
                        })
                    }
                    {/*<td className="border p-2 px-4">
                        <span className="bg-green-200 rounded-md px-2 font-medium text-green-700">
                            {estadoCelda + '/' + cantidadDias}
                        </span>
                    </td>*/}
                </tr>
            );
        });

    }

    const fechaActual = new Date()
    const nombreDia = diaSelect.find(dia => dia.id === fechaActual.getDay())?.dia || 'Desconocido'
    const fechaLetras = fechaActual.toLocaleDateString()

    const isDiasHabil = fechaActual.getDay() >= 1 && fechaActual.getDay() <= 5; // Lunes a Viernes
    const isFinDeSemana = fechaActual.getDay() === 6 || fechaActual.getDay() === 7; // Sábado o Domingo

    let valorDiasEstado = true

    if (props.item.dias == 'Lunes a Viernes' && isDiasHabil) { valorDiasEstado = false }
    if (props.item.dias == 'Sabados y Domingos' && isFinDeSemana) { valorDiasEstado = false }

    const obtenerFechas = (inicio: Date, fin: Date, diasSemana: string) => {
        const nombreDia = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

        let arrayDias: number[] = []

        if (diasSemana === 'Lunes a Viernes') {
            arrayDias = [1, 2, 3, 4, 5]
        }
        if (diasSemana === 'Sabados y Domingos') {
            arrayDias = [0, 6]
        }

        //console.log(arrayDias)

        const fechas = [];
        const current = new Date(inicio);
        const finFecha = new Date(fin)

        while (current <= finFecha) {
            if (arrayDias.includes(current.getDay())) {
                const fechaConInfo = {
                    fecha: new Date(current),
                    numeroDia: current.getDate(),
                    numeroSemana: current.getDay(),
                    nombreDia: nombreDia[current.getDay()],
                    mes: meses[current.getMonth()], // Meses en JavaScript se cuentan desde 0
                    fechaString: current.getFullYear() + '-' + String(current.getMonth() + 1).padStart(2, "0") + '-' + String(current.getDate()).padStart(2, "0")
                };

                fechas.push(fechaConInfo);
            }
            current.setDate(current.getDate() + 1);
        }

        return fechas;
    };

    const fechas = obtenerFechas(props.item.f_clases_ini, props.item.f_clases_fin, props.item.dias);


    //console.log(props.item.f_clases_ini, props.item.f_clases_fin, props.item)
    //console.log(obtenerFechas(props.item.f_clases_ini, props.item.f_clases_fin, props.item.dias))
    //console.log(fechaSeleccionada)

    return (
        <>
            <div className="p-1 bg-Solid">
                <div className="flex justify-between mb-4">
                    <h2 className="text-2xl font-bold ">
                        <span onClick={props.handleCloseModuloAsistencia} title="Atrás" role="button">
                            <i className="bi bi-arrow-left-circle-fill text-blue-500"></i>
                        </span> Registro de Asistencia
                    </h2>
                    <div className="flex gap-4">
                        <button
                            className={`hover:bg-gray-700 text-white font-semibold text-sm py-2 px-4 rounded ${activeContent === 1 ? 'bg-blue-600' : 'bg-gray-400'}`}
                            onClick={() => handleButtonClick(1)}
                        >
                            <i className="bi bi-list-check mr-2" /> Registro general
                        </button>
                        <button
                            className={`hover:bg-gray-700 text-white font-semibold text-sm py-2 px-4 rounded ${activeContent === 2 ? 'bg-blue-600' : 'bg-gray-400'}`}
                            onClick={() => handleButtonClick(2)}
                        >
                            <i className="bi bi-list-check mr-2" />  Asistencia diaria
                        </button>
                        <button
                            className={`hover:bg-gray-700 text-white font-semibold text-sm py-2 px-4 rounded ${activeContent === 3 ? 'bg-blue-600' : 'bg-gray-400'}`}
                            onClick={() => handleButtonClick(3)}
                        >
                            <i className="bi bi-list-check mr-2" /> Asistencia especifica
                        </button>

                    </div>
                </div>


                <div className="w-full">

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-1 mb-2 mt-3">
                        <div className="w-full rounded-lg border-2 border-gray-300 border-t-4">
                            <div className="m-2">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                    <div className="text-sm">
                                        <p>Asignatura: <span className="text-blue-700 font-bold">{props.item.asignatura}</span></p>
                                        <p>Sede: <span className="text-blue-700 font-bold">{props.item.sede}</span></p>
                                        <p>Periodo: <span className="text-blue-700 font-bold">{props.item.anio} - {props.item.mes}</span></p>
                                        <p>Aula: <span className="text-blue-700 font-bold">{props.item.aula}</span></p>
                                        {/*<p>Instructor: <span className="text-blue-700 font-bold">{props.item.docenteDni ? '' : props.item.docenteDni} / {props.item.docente ? '' : props.item.docente}</span></p>*/}
                                        <p>Dias de clases: <span className="text-blue-700 font-bold">{props.item.dias}</span></p>
                                    </div>
                                    <div className="text-sm">
                                        <p>Tipo Estudio: <span className="text-blue-700 font-bold ">{props.item.tipoEstudio}</span></p>
                                        <p>Modalidad: <span className="text-blue-700 font-bold ">{props.item.modalidad}</span></p>
                                        <p>Turno: <span className="text-blue-700 font-bold">{props.item.turno}</span></p>

                                        <p>Sección: <span className="text-blue-700 font-bold">{props.item.seccion}</span></p>
                                        <p>Horas: <span className="text-blue-700 font-bold">{props.item.horaInicio.slice(0, -3)} - {props.item.horaFin.slice(0, -3)}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        {(activeContent != 1) &&
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-1 mb-2 mt-3">
                                <div className="relative flex flex-wrap">
                                    <div className="flex gap-16">
                                        {
                                            activeContent == 3 &&
                                            <div className="flex gap-2">
                                                <label className="my-auto text-base font-semibold text-gray-500">Fecha</label>
                                                <input
                                                    type="date"
                                                    value={fechaSeleccionada}
                                                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                                                />
                                            </div>
                                        }

                                        <button
                                            disabled={valorDiasEstado}
                                            className={`flex items-center rounded border-md p-2 px-4 text-sm text-white font-semibold 
                                                            ${valorDiasEstado ?
                                                    'bg-gray-500 border-gray-500'
                                                    :
                                                    'bg-green-500 border-green-500 hover:bg-green-700 focus:ring-2 focus:ring-green-400 active:ring-green-400'} `}
                                            onClick={registrarAsistenciaMasivo}
                                        >
                                            <i className="bi bi-floppy2 mr-2"></i> Registrar Asistencia
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="relative overflow-auto rounded-md my-3 overflow-y-auto">
                            <table className=" text-gray-700 border table-auto" id="tabla-reporte">
                                <thead className="bg-upla-100 text-white">
                                    <tr>
                                        <th className="py-1 px-2 uppercase">#</th>
                                        <th className="py-1 px-2 uppercase">Codigo</th>
                                        <th className="py-1 px-2 uppercase">Estudiante</th>
                                        <th className="py-1 px-6 uppercase">Sede</th>
                                        {
                                            activeContent != 1 &&
                                            <th className="py-2 px-6 flex flex-col gap-2">
                                                {
                                                    activeContent == 2 &&
                                                    <div className="uppercase mx-auto">
                                                        {nombreDia} - {fechaLetras}
                                                    </div>
                                                }
                                                <div className={`gap-2 mx-auto ${valorDiasEstado ? 'hidden' : 'flex'}`}>
                                                    <span className="font-semibold text-sm">Seleccionar Todo</span>
                                                    <input
                                                        className="my-auto"
                                                        type="checkbox"
                                                        checked={seleccionarTodos}
                                                        onChange={handleSeleccionarTodos}
                                                    />
                                                </div>
                                            </th>
                                        }

                                        {/*<th className="bg-white border border-white w-10">

                                    </th>*/}
                                        {//FALTA DINAMIZARLO
                                            activeContent == 1 &&
                                            obtenerFechas(props.item.f_clases_ini, props.item.f_clases_fin, props.item.dias).map((fecha, index) => {

                                                //console.log(fecha)

                                                return (
                                                    <th key={index} className="py-1 px-4 text-xs">
                                                        <div title={fecha.nombreDia} className="flex flex-col">
                                                            <span>{fecha.numeroDia}</span>
                                                            <span>{fecha.mes}</span>
                                                        </div>
                                                    </th>
                                                );
                                            })
                                        }
                                        {/*<th className="bg-gray-500 py-1 px-2">%</th>*/}
                                    </tr>
                                </thead>
                                <tbody>
                                    {generarBody()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}

export default RegistrarAsistenciaGeneral