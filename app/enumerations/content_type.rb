class ContentType < EnumerateIt::Base
  associate_values(
    open_content: [1, 'Open Content'],
    analysis_dashboard: [2, 'Analysis Dashboard'],
    homepage: [3, 'Homepage'],
    map: [4, 'Map'],
    link: [5, 'Link'],
    static_content: [6, 'Static Content'],
    dashboard_v2: [7, 'Dashboard V2']
  )
end
