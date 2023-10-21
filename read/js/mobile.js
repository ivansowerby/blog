$().ready(() => {
    async function mobilePromise() {
        return await $.getJSON("json/mobile.json").then((obj) => {
            const unfriendly = obj["unfriendly"];
            //classes
            const unfriendlyClasses = unfriendly["classes"];
            const selectors = unfriendlyClasses.map((_class) => `.${_class}`);
            //thresholds
            const unfriendlyThresholds = unfriendly["thresholds"];
            const thresholdWidth = unfriendlyThresholds["width"];
            const flags = [
                () => $("body").prop("clientWidth") < thresholdWidth
            ];
            return [selectors, flags]
        }); 
    }
    
    const mobileResolver = Promise.resolve(mobilePromise());

    $(window).on("resize", () => {
        mobileResolver.then(([selectors, flags]) => {
            mobileFriendly(selectors, flags.map((flag) => flag()));
        });
    });

    function mobileFriendly(selectors, flags) {
        const targets = $(...selectors);
        if(any(flags)) {
            targets.css("display", "none");
        }
        else if(targets.css("display") == "none") {
            targets.css("display", "inline");
        }
    }
});