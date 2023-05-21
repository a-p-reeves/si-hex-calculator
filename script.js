
// -------------------------------------------- fluid data / selection --------------------------------------------
function getdata() {
    let fluid_tube = document.getElementById('fluid_tube').value                // tube fluid selector
    let fluid_shell = document.getElementById('fluid_shell').value              // shell fluid selector

    if (fluid_shell=='water'){
        document.getElementById('input_rho_shell').innerHTML = '<input id="rho_shell" type="numbers" value="997" style="background-color:lightgrey;" readonly>';
        document.getElementById('input_mu_shell').innerHTML = '<input id="mu_shell" type="numbers" value="0.890" style="background-color:lightgrey;" readonly>';
        document.getElementById('input_cp_shell').innerHTML = '<input id="cp_shell" type="numbers" value="4.2" style="background-color:lightgrey;" readonly>';
    }
    else {
        document.getElementById('input_rho_shell').innerHTML = '<input id="rho_shell" type="numbers" value="997"></input>';
        document.getElementById('input_mu_shell').innerHTML = '<input id="mu_shell" type="numbers" value="0.890"></input>';
        document.getElementById('input_cp_shell').innerHTML = '<input id="cp_shell" type="numbers" value="4.2"></input>';
    }
    
    if (fluid_tube=='water'){
        document.getElementById('input_rho_tube').innerHTML = '<input id="rho_tube" type="numbers" value="997" style="background-color:lightgrey;" readonly>';
        document.getElementById('input_mu_tube').innerHTML = '<input id="mu_tube" type="numbers" value="0.890" style="background-color:lightgrey;" readonly>';
        document.getElementById('input_cp_tube').innerHTML = '<input id="cp_tube" type="numbers" value="4.2" style="background-color:lightgrey;" readonly>';
    }
    else {
        document.getElementById('input_rho_tube').innerHTML = '<input id="rho_tube" type="numbers" value="997"></input>';
        document.getElementById('input_mu_tube').innerHTML = '<input id="mu_tube" type="numbers" value="0.890"></input>';
        document.getElementById('input_cp_tube').innerHTML = '<input id="cp_tube" type="numbers" value="4.2"></input>';
    }

        
    //let rho_shell = document.getElementById('rho_shell').value                  // shell fluid density (kg/m3)
    //let mu_shell = document.getElementById('mu_shell').value                    // shell fluid dyn. viscosity
}


// -------------------------------------------- main calculation function -------------------------------------------- 
function calculatehex() {
    
    // -------------------------------------------- inputs -------------------------------------------- 

    let hs = document.getElementById('hs').value                                // hot stream selection
    let L = document.getElementById('L').value                                  // tube length (m)
    let tube_od = document.getElementById('tube_od').value/1000                 // tube outer diameter (mm)
    let tube_thickness = document.getElementById('tube_thickness').value/1000   // tube thickness (mm) 
    let efficiency = document.getElementById('efficiency').value                // efficiency factor
    let T_hot_in = document.getElementById('T_hot_in').value                  // tube T in
    let T_hot_out = document.getElementById('T_hot_out').value                // tube T out
    
    let rho_tube = document.getElementById('rho_tube').value                    // tube fluid density
    let mu_tube = document.getElementById('mu_tube').value                      // tube fluid dyn. viscosity
    let cp_tube = document.getElementById('cp_tube').value                      // tube fluid heat capacity
    let T_cold_in = document.getElementById('T_cold_in').value                // shell T in
    let T_cold_out = document.getElementById('T_cold_out').value              // shell T out
    let cp_shell = document.getElementById('cp_shell').value                    // shell fluid heat capacity 
    let U = document.getElementById('U').value;                                 // defined U value

    let flowrate_hot = document.getElementById('flowrate_hot').value            // hot stream flowrate
    
    let flowrate_cold = 1;
    let flowrate_shell = 1;
    let flowrate_tube = 1;
    let T_shell_in = 1;
    let T_shell_out = 1;
    let T_tube_in = 1;
    let T_tube_out = 1;
    let tube_id = 1;
    let lmtd = 1;
    let lmtd_corrected = 1;
    let Q_initial = 1;
    let Q = 0;
    let A = 0;
    let dP_tube = 1;
    let V_tube = 1;
    let Re_tube = 1;
    let NT = 1;
    let f  = 1;                                 // friction factor
    
    // -------------------------------------------- initialization --------------------------------------------

    // stream allocation
    if (hs=='tube') {
        T_tube_in = T_hot_in ;
        T_tube_out = T_hot_out;
        T_shell_in = T_cold_in;
        T_shell_out = T_cold_out;

        flowrate_tube = flowrate_hot;

        // Q initial
        Q_initial = ((flowrate_tube/3600)*cp_tube*Math.abs(T_tube_in-T_tube_out));            //m*Cp*dT in W

        flowrate_shell = (Q_initial/(cp_shell*Math.abs(T_shell_in-T_shell_out)))*3600;        // kg/h
        flowrate_cold = flowrate_shell;
    }
    else {
        T_shell_in = T_hot_in;
        T_shell_out = T_hot_out;
        T_tube_in = T_cold_in;
        T_tube_out = T_cold_out;

        flowrate_shell = flowrate_hot;

        // Q initial
        Q_initial = ((flowrate_shell/3600)*cp_shell*Math.abs(T_shell_in-T_shell_out));          //m*Cp*dT in W

        flowrate_tube = (Q_initial/(cp_tube*Math.abs(T_tube_in-T_tube_out)))*3600;              // kg/h
        flowrate_cold = flowrate_tube;
    }

    // -------------------------------------------- error checks --------------------------------------------

    // check for stream crossover
    if (T_cold_out > T_hot_out || T_cold_in > T_hot_in) {
        document.getElementById('warning_label').innerHTML = '<div style="padding:30px; color:white; background-color:red; border:1px solid black; width:50%">Error: Stream Temperature Crossover!</div>';
        return;
    }
    else {
        document.getElementById('warning_label').innerHTML = '<div style="padding:30px; color:black; background-color:white; border:1px solid black; width:50%">Ready</div>';
    }
    
    // -------------------------------------------- calculations --------------------------------------------

    // geometry
    tube_id = tube_od - tube_thickness;

    // LMTD
    lmtd = ((T_hot_in-T_cold_out)-(T_hot_out-T_cold_in))/(Math.log((T_hot_in-T_cold_out)/(T_hot_out-T_cold_in)));
    lmtd_corrected = lmtd*efficiency;                                                   

    // Area from guesses
    A = (Q_initial*1000)/(U*lmtd_corrected);

    // Q
    Q = U*A*lmtd_corrected;

    // Fluid velocity
    V_tube = ((flowrate_tube/3600)/(rho_tube))/(3.1415926535*Math.pow((tube_id/2),2));      // fluid velocity from geometry and density

    // pressure drop in tubes
    f = 0.0014+0.125*Math.pow(Re_tube,-0.32);                                               // friction factor correlation (Re > 2100, but assumed accurate anyways) 
    dP_tube = (2*f*Math.pow(V_tube,2)*L)/(tube_id);

    // Reynold's number
    Re_tube = (rho_tube*V_tube*tube_id)/(mu_tube);                                          //flow assumed isothermal

    // Number of tubes
    NT = A/(3.1415926535*(tube_od)*L);

    // -------------------------------------------- outputs -------------------------------------------- 
    document.getElementById('V_tube').innerHTML = V_tube.toFixed(2);
    document.getElementById('Re_tube').innerHTML = Re_tube.toFixed(2);
    document.getElementById('dP_tube').innerHTML = dP_tube.toFixed(2);
    document.getElementById('flowrate_shell').innerHTML = (flowrate_shell).toFixed(2);
    document.getElementById('lmtd').innerHTML = lmtd.toFixed(2);
    document.getElementById('lmtd_corrected').innerHTML = lmtd_corrected.toFixed(2);
    document.getElementById('Q').innerHTML = (Q/1000).toFixed(2);
    document.getElementById('A').innerHTML = A.toFixed(2);
    document.getElementById('NT').innerHTML = NT.toFixed(0);
}

// -------------------------------------------- reload -------------------------------------------- 
function reload() {
    window.location.reload()
}