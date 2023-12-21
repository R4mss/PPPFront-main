import { ArrowRightOnCicleSvg } from "@/component/Svg.component";
import { NavLink } from "react-router-dom";
import Card from "../../component/pages/cards/CardDash"
import { images } from "../../helper/index.helper";
import { Pregunta, Identificacion, MultipleCheck, Boleta, Horario, Libro } from '../../component/Iconos';


const HomeEstudiante = () => {

    return (
        <div className="flex flex-wrap">
            <div className="w-full max-w-full px-3 flex-0">
                <div className="flex flex-col visible w-full h-auto min-w-0 p-4 break-words bg-white opacity-100 border rounded-md bg-clip-border">

                    <div className="grid grid-flow-row grid-cols-3 p-2">
                        <div className="col-span-3 px-4 mb-8">
                            <div className="flex flex-wrap justify-center mt-5">
                                <div className="w-full lg:w-1/3 sm:w-1/2 px-2 mb-4">
                                    <Card
                                        imagen={<Libro />}
                                        titulo={'Consolidado de matrícula'}
                                        subTitulo={'Realiza tu matrícula.'}
                                        color={'yellow'}
                                        to={'/inicio/consolidado'}
                                        info={''}
                                    />
                                </div>
                                <div className="w-full lg:w-1/3 sm:w-1/2 px-2 mb-4">
                                    <Card
                                        imagen={<Horario />}
                                        titulo={'Horario'}
                                        subTitulo={'Revisa tu experiencia en Idiomas Upla.'}
                                        color={'yellow'}
                                        to={'/inicio/proceso'}
                                        info={''}
                                    />
                                </div>
                                <div className="w-full lg:w-1/3 sm:w-1/2 px-2 mb-4">
                                    <Card
                                        imagen={<Boleta />}
                                        titulo={'Boleta de notas'}
                                        subTitulo={'Administra tus peticiones.'}
                                        color={'yellow'}
                                        to={'/inicio/boleta-notas'}
                                        info={''}
                                    />
                                </div>
                                <div className="w-full lg:w-1/3 sm:w-1/2 px-2 mb-4">
                                    <Card
                                        imagen={<Horario />}
                                        titulo={'Inasistencia por ciclo'}
                                        subTitulo={'Administra tus peticiones.'}
                                        color={'yellow'}
                                        to={'/inicio/inasistencia'}
                                        info={''}
                                    />
                                </div>
                                <div className="w-full lg:w-1/3 sm:w-1/2 px-2 mb-4">
                                    <Card
                                        imagen={<Identificacion />}
                                        titulo={'Datos personales'}
                                        subTitulo={'Administra tus peticiones.'}
                                        color={'yellow'}
                                        to={'/inicio/proceso'}
                                        info={''}
                                    />
                                </div>
                                <div className="w-full lg:w-1/3 sm:w-1/2 px-2 mb-4">
                                    <Card
                                        imagen={<Pregunta />}
                                        titulo={'Resultado Postulante'}
                                        subTitulo={'Administra tus peticiones.'}
                                        color={'yellow'}
                                        to={'/inicio/resultados-postulante'}
                                        info={''}
                                    />
                                </div>
                            </div>
                            {/* <div className="rounded overflow-hidden shadow-lg mx-auto border border-blue-200">
                                <div className="flex">
                                    <div className="w-1/2 px-6 py-4">
                                        <h2 className="text-xl font-mont uppercase font-bold pb-3 ">
                                            !Aprende un nuevo idioma y amplía tus horizontes¡
                                        </h2>
                                        <p className="font-mont text-justify">
                                            En un mundo cada vez más interconectado, el dominio de varios idiomas se ha convertido en una habilidad esencial y ofrecemos una amplia gama de programas de aprendizaje de idiomas, desde cursos intensivos hasta clases regulares, adaptados a las necesidades específicas de la actulidad.
                                        </p>
                                        <p className="font-mont text-justify">
                                            Nuestros expertos te guiarán en tu aprendizaje de idiomas, comprometidos con tus metas y listos para cambiar tu mundo. Descubre el poder de los idiomas.
                                        </p>
                                        <button type="button" className="font-mont  text-white bg-upla-100 hover:bg-upla-200 hover:transition-all focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/3 px-5 py-2.5 text-center mt-3">
                                            <NavLink to={'/inicio/matricula-interna'}>                                                 <div className="flex justify-center items-center">
                                                <ArrowRightOnCicleSvg />
                                                <span>
                                                    Matriculate
                                                </span>
                                            </div>
                                            </NavLink>
                                        </button>
                                    </div>
                                    <div className="w-1/2">
                                        <img
                                            className="w-full h-auto max-h-[300px] object-cover"
                                            src={images.portada}
                                            alt="Card Image"
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>





                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomeEstudiante