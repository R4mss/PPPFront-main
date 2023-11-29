import Programa from "./programa/programa"
import Modalidad from "./modalidad/modalidad"
import Sede from "./sede/sede"
import Idioma from "./idioma/idioma"
import Turno from "./turno/turno"
import Periodo from "./periodo/periodo"
import TipoEstudio from "./tipo-estudio/tipoEstudio"
import Asignatura from "./asignatura/asignatura"
import DocenteInfo from "./docente/docenteInfo"
import ListHorarioDetId from "./horario/listHorarioDetId"

export default interface Listas {
    resultado: Programa[] | Modalidad[] | Sede[] | Idioma[] | Turno[] | Periodo[] | TipoEstudio[] | Asignatura[] | DocenteInfo[] | ListHorarioDetId[]
}