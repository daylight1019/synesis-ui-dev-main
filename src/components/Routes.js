import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import PropsRoute from "../utils/PropsRoute";
import Architect from "../pages/Architect";
import Validator from "../pages/Validator";
import Builder from "../pages/Builder";
import Home from "../pages/Home";

function Routes(props) {
    const { selectLanding } = props;

    return (
        <Switch>
            <PropsRoute path="/" exact component={Home} selectLanding={selectLanding} />

            <PropsRoute path="/architect" exact component={Architect} selectLanding={selectLanding} />

            <PropsRoute path="/validator" exact component={Validator} selectLanding={selectLanding} />

            <PropsRoute path="/builder" exact component={Builder} selectLanding={selectLanding} />
        </Switch>
    );
}

Routes.propTypes = {
    selectLanding: PropTypes.func.isRequired,
};

export default memo(Routes);
