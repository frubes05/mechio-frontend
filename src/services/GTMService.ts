export const GTMTrackingHelper = (event: string, action: string, category: string, label: string, value: string | null | number) => {
    window.dataLayer.push({
        event,
        eventProps: {
            action,
            category,
            label,
            value
        }
    })
}