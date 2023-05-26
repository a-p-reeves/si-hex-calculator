
// -------------------------------------------- fluid data / selection --------------------------------------------
function getdata() {

    let passes = document.getElementById('passes').value                        // passes selector

    // -------------------------------------------- flow type for 1-1 exchanger -------------------------------------------- 

    if (passes =='1-1'){
        document.getElementById('input_flowtype').innerHTML = '<td><select id="flowtype" type="string" value="countercurrent" style="width:100%;" onclick="visualise()"><option value="countercurrent">counter-current</option><option value="cocurrent">co-current</option>';
    }
    else {
        document.getElementById('input_flowtype').innerHTML = '<td><select id="flowtype" type="string" value="mixed" style="width:100%; background-color:lightgrey;" onclick="visualise()" readonly><option value="mixed">mixed</option>';
    }

    // -------------------------------------------- fluid data inputs -------------------------------------------- 

    let fluid_tube = document.getElementById('fluid_tube').value                // tube fluid selector
    let fluid_shell = document.getElementById('fluid_shell').value              // shell fluid selector
    
    // ############# fluid data ############# 

    // unfortunately not adjusted for temperature and pressure yet. 
    // Source for cP: https://www.engineeringtoolbox.com/specific-heat-fluids-d_151.html 

    // water
    let rho_water = 998;
    let mu_water = 1.00;
    let cP_water = 4.18;

    // sea water
    let rho_sea = 1025;
    let mu_sea = 1.09;
    let cP_sea = 4.01;

    // light crude
    let rho_light = 800;
    let mu_light = 12.00;
    let cP_light = 1.67;

    // heavy crude
    let rho_heavy = 900;
    let mu_heavy = 16.00;
    let cP_heavy = 2.50;

    // gasoline
    let rho_gas = 700;
    let mu_gas = 1.00;
    let cP_gas = 2.13;

    // ############# end of fluid data ############# 

    // working variables - default values on start => water values 

    let rho_shell = rho_water;
    let mu_shell = mu_water;
    let cP_shell = cP_water;

    let rho_tube = rho_water;
    let mu_tube = mu_water;
    let cP_tube = cP_water;

    // shell
    if (fluid_shell=='water'){
        rho_shell = rho_water;
        mu_shell = mu_water;
        cP_shell = cP_water;
    }
    if (fluid_shell=='sea'){
        rho_shell = rho_sea;
        mu_shell = mu_sea;
        cP_shell = cP_sea;
    }
    if (fluid_shell=='light'){
        rho_shell = rho_light;
        mu_shell = mu_light;
        cP_shell = cP_light;
    }
    if (fluid_shell=='heavy'){
        rho_shell = rho_heavy;
        mu_shell = mu_heavy;
        cP_shell = cP_heavy;
    }
    if (fluid_shell=='gas'){
        rho_shell = rho_gas;
        mu_shell = mu_gas;
        cP_shell = cP_gas;
    }

    if (fluid_shell=='custom'){
        document.getElementById('input_rho_shell').innerHTML = '<input id="rho_shell" type="numbers" value="'+rho_shell+'"></input>';
        document.getElementById('input_mu_shell').innerHTML = '<input id="mu_shell" type="numbers" value="'+mu_shell+'"></input>';
        document.getElementById('input_cp_shell').innerHTML = '<input id="cp_shell" type="numbers" value="'+cP_shell+'"></input>';
    }
    else {
        document.getElementById('input_rho_shell').innerHTML = '<input id="rho_shell" type="numbers" value="'+rho_shell+'" style="background-color:lightgrey;" readonly></input>';
        document.getElementById('input_mu_shell').innerHTML = '<input id="mu_shell" type="numbers" value="'+mu_shell+'" style="background-color:lightgrey;" readonly></input>';
        document.getElementById('input_cp_shell').innerHTML = '<input id="cp_shell" type="numbers" value="'+cP_shell+'" style="background-color:lightgrey;" readonly></input>';
    }
    
    // tube
    if (fluid_tube=='water'){
        rho_tube = rho_water;
        mu_tube = mu_water;
        cP_tube = cP_water;
    }
    if (fluid_tube=='sea'){
        rho_tube = rho_sea;
        mu_tube = mu_sea;
        cP_tube = cP_sea;
    }
    if (fluid_tube=='light'){
        rho_tube = rho_light;
        mu_tube = mu_light;
        cP_tube = cP_light;
    }
    if (fluid_tube=='heavy'){
        rho_tube = rho_heavy;
        mu_tube = mu_heavy;
        cP_tube = cP_heavy;
    }
    if (fluid_tube=='gas'){
        rho_tube = rho_gas;
        mu_tube = mu_gas;
        cP_tube = cP_gas;
    }
    if (fluid_tube=='custom'){
        document.getElementById('input_rho_tube').innerHTML = '<input id="rho_tube" type="numbers" value="'+rho_tube+'"></input>';
        document.getElementById('input_mu_tube').innerHTML = '<input id="mu_tube" type="numbers" value="'+mu_tube+'"></input>';
        document.getElementById('input_cp_tube').innerHTML = '<input id="cp_tube" type="numbers" value="'+cP_tube+'"></input>';
    }
    else {
        document.getElementById('input_rho_tube').innerHTML = '<input id="rho_tube" type="numbers" value="'+rho_tube+'" style="background-color:lightgrey;" readonly></input>';
        document.getElementById('input_mu_tube').innerHTML = '<input id="mu_tube" type="numbers" value="'+mu_tube+'" style="background-color:lightgrey;" readonly></input>';
        document.getElementById('input_cp_tube').innerHTML = '<input id="cp_tube" type="numbers" value="'+cP_tube+'" style="background-color:lightgrey;" readonly></input>';
    }
}

// -------------------------------------------- visualisation -------------------------------------------- 
function visualise() {

    let passes = document.getElementById('passes').value                            // passes selector
    let flowtype = document.getElementById('flowtype').value;                       // flow type
    let T_hot_in = document.getElementById('T_hot_in').value;                       // hot T in
    let T_hot_out = document.getElementById('T_hot_out').value;                     // hot T out
    let T_cold_in = document.getElementById('T_cold_in').value;                     // cold T in
    let T_cold_out = document.getElementById('T_cold_out').value;                   // cold T out
    let hs = document.getElementById('hs').value;                                   // hot stream selection
    
    //define temperatures by order of appearance on screen
    let T1 = 1;
    let T2 = 2;
    let T3 = 3;
    let T4 = 4;

    //define hot/cold letter (H/C) in order of appearance on screen
    let L1 = "";
    let L2 = "";
    let L3 = "";
    let L4 = "";
    
    if (hs == "tube"){  // tube side: hot stream; shell side: hot stream; 

        document.getElementById('tube_indicator').innerHTML = '<div style="color:red;">[Hot]</div>';
        document.getElementById('shell_indicator').innerHTML = '<div style="color:blue;">[Cold]</div>';

        L1 = "<span style='color:red;'>H</span>";
        L2 = "<span style='color:blue;'>C</span>";  

        T1 = T_hot_in;
        T2 = T_cold_in;
        if (passes == "1-1") {
            L3 = "<span style='color:blue;'>C</span>";
            L4 = "<span style='color:red;'>H</span>";

            T3 = T_cold_out;
            T4 = T_hot_out;
        }
        else {
            L3 = "<span style='color:red;'>H</span>";
            L4 = "<span style='color:blue;'>C</span>";

            T3 = T_hot_out;
            T4 = T_cold_out;
        }
    }
    else {  // tube side: cold stream; shell side: hot stream; 

        document.getElementById('tube_indicator').innerHTML = '<div style="color:blue;">[Cold]</div>';
        document.getElementById('shell_indicator').innerHTML = '<div style="color:red;">[Hot]</div>';

        L1 = "<span style='color:blue;'>C</span>";
        L2 = "<span style='color:red;'>H</span>";

        T1 = T_cold_in;
        T2 = T_hot_in;
        if (passes == "1-1") {
            L3 = "<span style='color:red;'>H</span>";
            L4 = "<span style='color:blue;'>C</span>";

            T3 = T_hot_out;
            T4 = T_cold_out;
        }
        else {
            L3 = "<span style='color:blue;'>C</span>";
            L4 = "<span style='color:red;'>H</span>";

            T3 = T_cold_out;
            T4 = T_hot_out;
        }
    }

    if (passes == "1-1") {
        if (flowtype == "countercurrent") {
            document.getElementById('hex_text-top').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L1+',in</sub> = '+T1+'°C &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L2+',in</sub> = '+T2+'°C';
            document.getElementById('hex_image').innerHTML = '<img src="1-1-counter.png" width="500px"></img>';
            document.getElementById('hex_text-bottom').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L3+',out</sub> = '+T3+'°C &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L4+',out</sub> = '+T4+'°C';
        }
        else {
            document.getElementById('hex_text-top').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L1+',in</sub> = '+T1+'°C &nbsp T<sub>'+L2+',in</sub> = '+T2+'°C';
            document.getElementById('hex_image').innerHTML = '<img src="1-1-co.png" width="500px"></img>';
            document.getElementById('hex_text-bottom').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L3+',out</sub>='+T3+'°C &nbsp T<sub>'+L4+',out</sub>='+T4+'°C';
        }
    }
    if (passes == "1-2") {
        document.getElementById('hex_text-top').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L1+',in</sub> = '+T1+'°C &nbsp T<sub>'+L2+',in</sub> = '+T2+'°C';
        document.getElementById('hex_image').innerHTML = '<img src="1-2.png" width="500px"></img>';
        document.getElementById('hex_text-bottom').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L3+',out</sub> = '+T3+'°C &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L4+',out</sub> = '+T4+'°C';
    }
    if (passes == "2-4") {
        document.getElementById('hex_text-top').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L1+',in</sub> = '+T1+'°C &nbsp T<sub>'+L2+',in</sub> = '+T2+'°C';
        document.getElementById('hex_image').innerHTML = '<img src="2-4.png" width="500px"></img>';
        document.getElementById('hex_text-bottom').innerHTML = '&nbsp &nbsp &nbsp &nbsp &nbsp T<sub>'+L3+',out</sub> = '+T3+'°C &nbsp T<sub>'+L4+',out</sub> = '+T4+'°C';
    }
}

// -------------------------------------------- main calculation function -------------------------------------------- 
function calculatehex() {
    
    // -------------------------------------------- inputs -------------------------------------------- 

    let hs = document.getElementById('hs').value;                                   // hot stream selection
    let flowtype = document.getElementById('flowtype').value;                       // flow type for 1-1 hex only
    let L = document.getElementById('L').value;                                     // tube length (m)
    let tube_od = document.getElementById('tube_od').value/1000;                    // tube outer diameter (mm)
    let tube_thickness = document.getElementById('tube_thickness').value/1000;      // tube thickness (mm) 
    let T_hot_in = document.getElementById('T_hot_in').value;                       // hot T in
    let T_hot_out = document.getElementById('T_hot_out').value;                     // hot T out
    let passes = document.getElementById('passes').value;                           // number of passes configuration
    let rho_tube = document.getElementById('rho_tube').value;                       // tube fluid density
    let mu_tube = document.getElementById('mu_tube').value;                         // tube fluid dyn. viscosity
    let cp_tube = document.getElementById('cp_tube').value;                         // tube fluid heat capacity
    let T_cold_in = document.getElementById('T_cold_in').value;                     // cold T in
    let T_cold_out = document.getElementById('T_cold_out').value;                   // cold T out
    let cp_shell = document.getElementById('cp_shell').value;                       // shell fluid heat capacity 
    let U = document.getElementById('U').value;                                     // defined U value
    let flowrate_hot = document.getElementById('flowrate_hot').value;               // hot stream flowrate
    let fluid_tube = document.getElementById('fluid_tube').value                    // tube fluid selector
    let fluid_shell = document.getElementById('fluid_shell').value                  // shell fluid selector

    // initialisation of variables. Safety net to avoid exceptions, not 100% neccessary
    let flowrate_cold = 1
    let flowrate_shell = 1
    let flowrate_tube = 1
    let T_shell_in = 1
    let T_shell_out = 1
    let T_tube_in = 1
    let T_tube_out = 1
    let tube_id = 1
    let lmtd = 1
    let lmtd_corrected = 1
    let Q_initial = 1
    let Q = 1
    let A = 1
    let dP_tube = 1
    let V_tube = 1
    let Re_tube = 1
    let NT = 1
    let f  = 1
    
    // -------------------------------------------- initialization --------------------------------------------

    // stream allocation
    if (hs=='tube') {
        T_tube_in = T_hot_in;
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

    // ready message (no errors)
    document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:white; border:1px solid black; width:100%">Status: Ready!</div>';

    // check for inputs less than zero
    if (U <= 0  || flowrate_hot <= 0  || L <= 0  || tube_thickness < 0  || rho_tube <= 0  || mu_tube <= 0  || cp_tube <= 0  || rho_shell <= 0  || mu_shell <= 0  || cp_shell <= 0 ) {
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:white; background-color:red; border:1px solid black; width:100%">Error: Invalid input (no negative or zero values allowed)!</div>';
        return;
    }

    // check geometry
    if (tube_od <= 2*tube_thickness){
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:white; background-color:red; border:1px solid black; width:100%">Error: Tube outer diameter must be greater than 2x the tube thickness!</div>';
        return;
    }

    // check hot stream                     
    if ( (T_hot_in-T_hot_out) <= 0) {           // bug: condition [ T_hot_in <= T_hot_out ] is true at T>99 (?) -> [ (T_hot_in-T_hot_out) <= 0 ] is used instead 
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:white; background-color:red; border:1px solid black; width:100%">Error: Hot stream inlet temperature must be higher than outlet temperature!</div>';
        return;
    }

    // check cold stream 
    if ((T_cold_out-T_cold_in) <= 0) {          // condition [ T_cold_out <= T_cold_in ] seems to be working but still used  same method as hot stream for consistency
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:white; background-color:red; border:1px solid black; width:100%">Error: Cold stream inlet temperature must be lower than outlet temperature!</div>';
        return;
    }

    // check for stream crossover
    if (T_cold_out > T_hot_out) {               
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:white; background-color:red; border:1px solid black; width:100%">Error: Stream Temperature Crossover!</div>';
        return;
    }

    // -------------------------------------------- warnings --------------------------------------------

    // phase change detector
    let boiling_point_tube = 10000;
    let freezing_point_tube = -10000;
    let boiling_point_shell = 10000;
    let freezing_point_shell = -10000;

    if (fluid_tube=='water'){
        freezing_point_tube = 0;
        boiling_point_tube = 100;
    }
    if (fluid_tube=='sea'){
        freezing_point_tube = -1.8;
        boiling_point_tube = 100;
    }
    if (fluid_tube=='light'){
        freezing_point_tube = 0;
        boiling_point_tube = 500;
    }
    if (fluid_tube=='heavy'){
        freezing_point_tube = -50;
        boiling_point_tube = 500;
    }
    if (fluid_tube=='gas'){
        freezing_point_tube = -50;
        boiling_point_tube = 70;
    }

    if (fluid_shell=='water'){
    freezing_point_shell = 0;
    boiling_point_shell = 100;
    }
    if (fluid_shell=='sea'){
        freezing_point_shell = -1.8;
        boiling_point_shell = 100;
    }
    if (fluid_shell=='light'){
        freezing_point_shell = 0;
        boiling_point_shell = 500;
    }
    if (fluid_shell=='heavy'){
        freezing_point_shell = -50;
        boiling_point_shell = 500;
    }
    if (fluid_shell=='gas'){
        freezing_point_shell = -50;
        boiling_point_shell = 70;
    }

    if (fluid_tube != 'custom') {
    // warning for phase change
        if (T_tube_in > boiling_point_tube || T_tube_out > boiling_point_tube) {               
            document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:orange; border:1px solid black; width:100%">Warning: Possible evaporation in tube detected! Phase change not currently supported.</div>';
        }
        if (T_tube_in < freezing_point_tube || T_tube_out < freezing_point_tube) {               
            document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:orange; border:1px solid black; width:100%">Warning: Possible freezing in tube detected! Phase change not currently supported.</div>';
        }
    }

    if (fluid_shell != 'custom') {
        // warning for phase change
            if (T_shell_in > boiling_point_shell || T_shell_out > boiling_point_shell) {               
                document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:orange; border:1px solid black; width:100%">Warning: Possible evaporation in shell detected! Phase change not currently supported.</div>';
            }
            if (T_shell_in < freezing_point_shell || T_shell_out < freezing_point_shell) {               
                document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:orange; border:1px solid black; width:100%">Warning: Possible freezing in shell detected! Phase change not currently supported.</div>';
            }
        }

    // -------------------------------------------- calculations --------------------------------------------

    // tube geometry
    tube_id = tube_od - 2*tube_thickness;

    // LMTD exception: x/ln(1)
    if ( ((T_hot_in-T_cold_out)/(T_hot_out-T_cold_in) == 1 ) ) {
        T_hot_in = T_hot_in + 0.00001;
    }
    // define temperature deltas (overwritten for co-current flow)
    let dT1 = T_hot_in-T_cold_out;
    let dT2 = T_hot_out-T_cold_in;
    if ( flowtype == 'cocurrent' )  {
        dT1 = T_hot_in-T_cold_in;
        dT2 = T_hot_out-T_cold_out;
    }
    // if temperature delta = 0 -> make very small non-zero value to avoid exception and display warning sign
    if ( dT1 == 0 )  {
        dT1 = 0.0000001;
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:orange; border:1px solid black; width:100%">Warning: ΔT<sub>1</sub>=0 therefore ΔT<sub>1</sub> set to 1E-6 K!</div>';
    }
    if ( dT2 == 0 )  {
        dT2 = 0.0000001;
        document.getElementById('warning_label').innerHTML = '<div style="padding:10px; color:black; background-color:orange; border:1px solid black; width:100%">Warning: ΔT<sub>2</sub>=0 therefore ΔT<sub>2</sub> set to 1E-6 K!</div>';
    }
    // LMTD
    lmtd = ((dT1)-(dT2))/(Math.log((dT1)/(dT2)));

    // correction factor correlation (Bowman et al. 1940), source: https://www.witpress.com/Secure/elibrary/papers/HT06/HT06032FU1.pdf
    let P_f = (T_cold_out-T_cold_in)/(T_hot_in-T_cold_in);
    let R_f = (T_hot_in-T_hot_out)/(T_cold_out-T_cold_in);
    
    let correction_factor = 1; //assign correction factor variable

    if (R_f==1){
        R_f = R_f + 0.001;
    }

    if (passes == "1-1") {
        correction_factor = 1;
    }
    if (passes == "1-2") {
        correction_factor = ((Math.sqrt(Math.pow(R_f,2)+1))/(R_f-1)) * ((Math.log((1-P_f)/(1-P_f*R_f))) / (Math.log( ((2/P_f) -1-R_f + Math.sqrt(Math.pow(R_f,2)+1)) / ((2/P_f)-1-R_f - Math.sqrt(Math.pow(R_f,2)+1)))));
    }
    
    if (passes == "2-4") {
        correction_factor = ((Math.sqrt(Math.pow(R_f,2)+1))/(2*(R_f-1))) * ((Math.log((1-P_f)/(1-P_f*R_f))) / (Math.log( ((2/P_f) -1-R_f + ((2/P_f)*Math.sqrt((1-P_f)*(1-P_f*R_f))) + Math.sqrt(Math.pow(R_f,2)+1)) / ((2/P_f) -1-R_f + ((2/P_f)*Math.sqrt((1-P_f)*(1-P_f*R_f))) - Math.sqrt(Math.pow(R_f,2)+1)))));
    }

    console.log('P 1/2: '+P_f.toFixed(3)+' R: '+R_f.toFixed(3)+' F: '+correction_factor.toFixed(6));

    // LMTD corrected
    lmtd_corrected = lmtd*correction_factor;

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
    document.getElementById('V_tube').innerHTML = '<input type="numbers" value="'+V_tube.toFixed(2)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('Re_tube').innerHTML = '<input type="numbers" value="'+Re_tube.toFixed(2)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('dP_tube').innerHTML = '<input type="numbers" value="'+(dP_tube/1000).toFixed(3)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('flowrate_cold').innerHTML = '<input type="numbers" value="'+flowrate_cold.toFixed(2)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('correction_factor').innerHTML = '<input type="numbers" value="'+correction_factor.toFixed(3)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('lmtd').innerHTML = '<input type="numbers" value="'+lmtd.toFixed(2)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('lmtd_corrected').innerHTML = '<input type="numbers" value="'+lmtd_corrected.toFixed(2)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('Q').innerHTML = '<input type="numbers" value="'+(Q/1000).toFixed(2)+'" style="background-color:#f6f6f6; width:100%;" readonly>';
    document.getElementById('A').innerHTML = '<input type="numbers" value="'+A.toFixed(2)+'" style="background-color:lightgrey; font-weight: bold; width:100%;" readonly>';
    document.getElementById('NT').innerHTML = '<input type="numbers" value="'+NT.toFixed(0)+'" style="background-color:#f6f6f6; width:100%;" readonly>';

    visualise();
}


// -------------------------------------------- reload -------------------------------------------- 
function reload() {
    window.location.reload()
}