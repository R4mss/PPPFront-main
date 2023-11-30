import Menu from "./widget/Menu";
import ListMenu from "./widget/ListMenu";
import Title from "./widget/Title";
import SubTitle from "./widget/SubTitle";
import Overlay from "./widget/Overlay";
import Body from "./widget/Body";
import EstudianteLogin from "../../../../model/interfaces/login/estudiante.login";
// import TrabajadorLogin from "../../../../model/interfaces/login/trabajador.login";

type Props = {
    informacion: EstudianteLogin | undefined,
    pathname: string,
    refAside: React.RefObject<HTMLInputElement>,
    refOverlay: React.RefObject<HTMLInputElement>,
    onEventOverlay: React.MouseEventHandler,
}

type MenuItem = {
    id: string,
    titulo: string,
    url?: string,
    icono: string,
    moduPadre: boolean,
    modPosicion: number,
    subMenu: boolean,
    subMenuItems?: MenuItem[]
}

const menus: MenuItem[] = [
    {
        id: "1",
        titulo: "Estudiante",
        icono: "bi-person-fill",
        moduPadre: true,
        modPosicion: 1,
        subMenu: false,
        subMenuItems: [
            // {
            //     id: "1",
            //     titulo: "Inicio",
            //     url: "/inicio/centro-idiomas",
            //     icono: "bi-house-fill",
            //     moduPadre: false,
            //     modPosicion: 1,
            //     subMenu: false,
            // },
            {
                id: "2",
                titulo: "Matricula Interna",
                url: "/inicio/matricula-interna",
                icono: "bi-pencil-square",
                moduPadre: false,
                modPosicion: 1,
                subMenu: false,
            },
            {
                id: "3",
                titulo: "Matricula Externa",
                url: "/inicio/matricula-externa",
                icono: "bi-pencil-square",
                moduPadre: false,
                modPosicion: 1,
                subMenu: false,
            },
            {
                id: "4",
                titulo: "Horario",
                url: "/inicio/horario",
                icono: "bi-calendar-week",
                moduPadre: false,
                modPosicion: 1,
                subMenu: false,
            },
        ],
    },
    // {
    //     id: "2",
    //     titulo: "Docente",
    //     icono: "bi-person-video3",
    //     moduPadre: true,
    //     modPosicion: 1,
    //     subMenu: false,
    //     subMenuItems: [
    //         {
    //             id: "1",
    //             titulo: "Inicio Docente",
    //             url: "/inicio/inicio-docente",
    //             icono: "bi-house-fill",
    //             moduPadre: false,
    //             modPosicion: 4,
    //             subMenu: false,
    //             subMenuItems: [],
    //         },
    //         {
    //             id: "2",
    //             titulo: "Horario",
    //             url: "/inicio/horario",
    //             icono: "bi-calendar-week",
    //             moduPadre: false,
    //             modPosicion: 1,
    //             subMenu: false,
    //         },
    //     ],
    // },
    {
        id: "2",
        titulo: "Administrativo",
        icono: "bi-person-vcard",
        moduPadre: true,
        modPosicion: 1,
        subMenu: false,
        subMenuItems: [
            {
                id: "1",
                titulo: "Notas",
                url: "/inicio/inicio-docente",
                icono: "bi-card-checklist",
                moduPadre: false,
                modPosicion: 4,
                subMenu: false,
                subMenuItems: [],
            },
            {
                id: "2",
                titulo: "Horario",
                url: "/inicio/horario-idiomas",
                icono: "bi-calendar-plus",
                moduPadre: false,
                modPosicion: 4,
                subMenu: false,
                subMenuItems: [],
            },

        ],
    },

];


const Aside = (props: Props) => {

    return (
        <Body refAside={props.refAside}>
            <div className="relative z-30 h-full overflow-y-auto py-4">
                <Title />

                <SubTitle informacion={props.informacion} />

                <ul id="menus">
                    {
                        menus.map((menu, index) => {
                            if (menu.subMenuItems?.length == 0) {
                                return <Menu
                                    key={index}
                                    pathname={props.pathname}
                                    icon={menu.icono}
                                    nombre={menu.titulo}
                                    to={menu.url!}
                                />
                            } else {
                                return <ListMenu
                                    key={index}
                                    idList={menu.id}
                                    desplegar={menu.subMenuItems?.filter(item => item.url === props.pathname).length != 0}
                                    icon={menu.icono}
                                    nombre={menu.titulo}
                                >
                                    {
                                        menu.subMenuItems?.map((submenu, indexm) => {
                                            return <Menu
                                                key={indexm}
                                                pathname={props.pathname}
                                                icon={submenu.icono}
                                                nombre={submenu.titulo}
                                                to={submenu.url!}
                                            />
                                        })
                                    }
                                </ListMenu>
                            }
                        })
                    }
                </ul>
            </div>
            <Overlay refOverlay={props.refOverlay} onEventOverlay={props.onEventOverlay} />
        </Body>
    );
}

export default Aside;